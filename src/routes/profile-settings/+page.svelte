<script>
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { user } from '$stores/user';
  import Input from '$uiKit/components/Input.svelte';
  import intlTelInput from 'intl-tel-input';
  import 'intl-tel-input/build/css/intlTelInput.css';
  import Avatar from '$uiKit/components/Avatar.svelte';
  import FileUploader from '$uiKit/components/FileUploader.svelte';
  import { PhoneNumberUtil } from 'google-libphonenumber';
  import { Toast, toaster } from '$uiKit/components/toast/index';
  import * as yup from 'yup';
  import Button from '$uiKit/components/Button.svelte';
  import Title from '$uiKit/components/Title.svelte';

  let inProgress;
  let errors = {
    firstName: '',
    lastName: '',
    phone: ''
  };

  const schema = yup.object({
    firstName: yup.string().required('Field is required'),
    lastName: yup.string().required('Field is required'),
    phone: yup.string().required('Field is required')
  });

  const validateForm = async (fieldName, value) => {
    if (fieldName) {
      try {
        const fieldSchema = yup.reach(schema, fieldName);
        await fieldSchema.validate(value);
        errors[fieldName] = '';
      } catch (validationErrors) {
        console.log(`Validation error for "${fieldName}":`, validationErrors.message);
        errors[fieldName] = validationErrors.message;
      }
    } else {
      const data = {
        firstName: $user.firstName,
        lastName: $user.lastName,
        phone: $user.phone
      };
      try {
        await schema.validate(data, { abortEarly: false });
        errors = {
          firstName: '',
          lastName: '',
          phone: ''
        };
        errors = { ...errors };
        handleUserUpdate();
      } catch (validationErrors) {
        errors = {
          firstName: '',
          lastName: '',
          phone: ''
        };
        console.log('Validation errors:', validationErrors.inner);
        validationErrors.inner.forEach((err) => {
          errors[err.path] = err.message;
        });
        errors = { ...errors };
      }
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    await validateForm(null, null);
  };

  function handleUserUpdate() {
    inProgress = true;
    const apiHeaders = new Headers();
    apiHeaders.append('Content-Type', 'application/x-www-form-urlencoded');

    const urlencoded = new URLSearchParams();
    for (const key in $user) {
      urlencoded.append(key, $user[key]);
    }

    const requestOptions = {
      method: 'PUT',
      headers: apiHeaders,
      body: urlencoded,
      redirect: 'follow'
    };

    fetch('https://mve.novus.studio/prod/users/update', requestOptions)
      .then((response) => response.json())
      .then((result) => {
        inProgress = false;
        console.log('result', result);
        if (result.err && result.err.length > 0) {
          toaster.error({
            title: 'Error',
            content: 'Something went wrong while updating information.',
            duration: 5000
          });
        } else {
          toaster.success({
            title: 'Success',
            content: "Information's updated successfully.",
            duration: 5000
          });
          goto('/dashboard');
        }
      })
      .catch((error) => console.error('error', error));
  }

  let imgElement = { src: '' };
  let updatePhoto = false;
  let phoneSelection;

  function saveFile(file) {
    const formdata = new FormData();
    formdata.append('emailAddress', $user.emailAddress);
    formdata.append('firstName', $user.firstName);
    formdata.append('lastName', $user.lastName);
    formdata.append('file', file);

    const requestOptions = {
      method: 'POST',
      body: formdata,
      redirect: 'follow'
    };

    fetch('https://mve.novus.studio/prod/users/uploadPhoto', requestOptions)
      .then((response) => response.json())
      .then((result) => {
        $user.thumbnail = result.url;
        inProgress = false;
        if (result.err && result.err.length > 0) {
          toaster.error({
            title: 'Error',
            content: 'Something went wrong while uploading profile photo.',
            duration: 5000
          });
        } else {
          toaster.success({
            title: 'Success',
            content: 'Profile photo updated successfully.',
            duration: 5000
          });
        }
      })
      .catch((error) => console.error(error));
  }

  const onFile = (data) => {
    saveFile(data.detail.file);
  };

  onMount(() => {
    const phoneUtil = PhoneNumberUtil.getInstance();
    const countryCode = phoneUtil.getRegionCodeForCountryCode($user.dialCode);

    const iti = intlTelInput(phoneSelection, {
      separateDialCode: true,
      initialCountry: countryCode.toLowerCase()
    });

    $user.dialCode = iti.activeItem.dataset.dialCode;

    phoneSelection.addEventListener('countrychange', function () {
      const selectedCountryDialCode = iti.activeItem.dataset.dialCode;
      phoneSelection.placeholder = selectedCountryDialCode;
      $user.dialCode = selectedCountryDialCode;
    });

    console.log('$user', $user);
  });
</script>

<div class="setting-header">
  <p>Profile Settings</p>
</div>

<form class="settings-container" on:submit|preventDefault={handleSubmit}>
  <Title title="Personal info" description="Update your photo and personal details here." size="md" width="full" />

  <div class="setting-divider"></div>

  <div class="settings-input-holder">
    <label for="name">
      Name <sup>(*required)</sup>
    </label>
    <div class="settings-inputs">
      <Input
        name="firstName"
        type="text"
        bind:value={$user.firstName}
        placeholder="First Name"
        error={errors.firstName}
        on:input={(value) => validateForm('firstName', value.detail)}
      />
      <Input
        name="lastName"
        type="text"
        bind:value={$user.lastName}
        placeholder="Last Name"
        error={errors.lastName}
        on:input={(value) => validateForm('lastName', value.detail)}
      />
    </div>
  </div>

  <div class="setting-divider"></div>

  <div class="settings-input-holder">
    <label for="email"> Contact details </label>
    <div class="settings-inputs">
      <Input
        name="phone"
        type="tel"
        bind:inputRef={phoneSelection}
        bind:value={$user.phone}
        error={errors.phone}
        on:input={(value) => validateForm('phone', value.detail)}
      />
    </div>
  </div>

  <div class="setting-divider"></div>

  <div class="settings-input-holder file-holder">
    <label for="fileSelector"> Profile picture user: {$user.thumbnail}</label>
    <div class="settings-logo-container">
      <div class="setting-logo-wrapper">
        <Avatar src={$user.thumbnail} alt={$user.firstName} placeholder={$user.firstName} changeable={false} />
      </div>
      <button type="button" on:click={() => ($user.thumbnail = '')} style="color: white;">Remove</button>
    </div>
    <FileUploader on:file={onFile} />
  </div>

  <div class="setting-divider"></div>

  <div class="settings-button-wrapper">
    <Button type="button" variant="additional">Cancel</Button>
    <Button type="submit" isSpinner={inProgress}>Save Changes</Button>
  </div>
</form>

<div class="settings-container">
  <Title
    title="Notification Preferences"
    description="Update your photo and personal details here."
    size="md"
    width="full"
  />

  <div class="setting-divider"></div>

  <div class="settings-input-holder notif-holder">
    <label> Email Notifications </label>
    <div class="settings-inputs notif-inputs">
      <div class="notif-item">
        <Title
          title="Analytics Updates"
          description="Receive notifications for significant changes in web analytics metrics such as page views, conversion rates, and bounce rates via email."
          type="choice"
          width="full"
          size="xs"
          toggleSize="sm"
        />
      </div>
      <div class="notif-item">
        <Title
          title="Experiment Results"
          description="Get notified about the completion of the experiments and the results, including which variant performed
            better and any statistical significance."
          type="choice"
          width="full"
          size="xs"
          toggleSize="sm"
        />
      </div>
      <div class="notif-item">
        <Title
          title="Purchase Activity"
          description="Stay informed about recent purchasing activity, including new paying customers, high-value transactions, and
            trends in purchase summary metrics."
          type="choice"
          width="full"
          size="xs"
          toggleSize="sm"
        />
      </div>
      <div class="notif-item">
        <Title
          title="System Updates"
          description="Stay informed about scheduled maintenance or new feature updates."
          type="choice"
          width="full"
          size="xs"
          toggleSize="sm"
        />
      </div>
    </div>
  </div>

  <div class="setting-divider"></div>

  <div class="settings-input-holder notif-holder">
    <label> Slack Notifications </label>
    <div class="settings-inputs notif-inputs">
      <div class="notif-item">
        <Title
          title="Alert System"
          description="Get notified about the spikes on page views and conversion rates via Slack."
          type="choice"
          width="full"
          size="xs"
          toggleSize="sm"
        />
      </div>
      <div class="notif-item">
        <Title
          title="Error Detection"
          description="Get notified about the errors real-time."
          type="choice"
          width="full"
          size="xs"
          toggleSize="sm"
        />
      </div>
    </div>
  </div>

  <div class="setting-divider"></div>

  <div class="settings-button-wrapper">
    <Button variant="additional">Cancel</Button>
    <Button>Save Changes</Button>
  </div>
</div>

{#if updatePhoto}
  <div class="update-photo-wrapper">
    <div class="photo-update-popup">
      <div class="close-button" on:click={() => (updatePhoto = !updatePhoto)}>
        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M10 2L2 10" stroke="#6E6D81" stroke-linecap="round" stroke-linejoin="round" />
          <path d="M2 2L10 10" stroke="#6E6D81" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </div>
      <div class="icon-holder">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path
            d="M22 11.08V12C21.9988 14.1564 21.3005 16.2547 20.0093 17.9818C18.7182 19.709 16.9033 20.9725 14.8354 21.5839C12.7674 22.1953 10.5573 22.1219 8.53447 21.3746C6.51168 20.6273 4.78465 19.2461 3.61096 17.4371C2.43727 15.628 1.87979 13.4881 2.02168 11.3363C2.16356 9.18456 2.99721 7.13633 4.39828 5.49707C5.79935 3.85782 7.69279 2.71538 9.79619 2.24015C11.8996 1.76491 14.1003 1.98234 16.07 2.86"
            stroke="white"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path d="M9 11L12 14L22 4" stroke="white" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </div>
      <p>Your new photo has been successfully added to your profile.</p>
      <a class="cta-button secondary" href="" on:click={() => (updatePhoto = !updatePhoto)}>Close</a>
    </div>
  </div>
{/if}
<Toast />

<style>
  .img-icon-holder {
    opacity: 0.56;
    padding-block: 0.1rem;
    background-color: #060b13;
    transform: translateY(-115%);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .update-photo-wrapper {
    position: fixed;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    background: rgba(6, 11, 19, 0.8);
    z-index: 100;

    display: flex;
    align-items: center;
    justify-content: center;
  }

  .photo-update-popup {
    position: relative;

    max-width: 34rem;
    border-radius: 1.6rem;
    background-color: rgba(13, 18, 26, 0.4);
    backdrop-filter: blur(1.2rem);

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;

    padding: 2.9rem 5.4rem;

    gap: 1.6rem;
    overflow: hidden;
    border: 0.1rem solid rgba(255, 255, 255, 0.08);
  }

  .photo-update-popup::before {
    content: '';
    position: absolute;
    top: 0;
    background-image: url('assets/icons/top-light.png');
    height: 29rem;
    width: 40rem;
    transform: translateX(9%) translateY(-39%);
    opacity: 1;
    filter: blur(8.2rem);
  }

  .photo-update-popup::after {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    background-image: url('assets/icons/right-light.png');
    height: 11rem;
    width: 20rem;
    opacity: 1;
    filter: blur(8.2rem);
    transform: translateY(-60%) translateX(80%);
  }

  .icon-holder {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1.6rem;

    background-color: rgba(255, 255, 255, 0.04);
    border-radius: 50%;
  }

  .close-button {
    z-index: 10;
    position: absolute;
    top: 1.6rem;
    right: 1.6rem;
    cursor: pointer;
  }

  .photo-update-popup p {
    font-size: 1.8rem;
    line-height: 2.2rem;
  }

  .photo-update-popup .cta-button {
    margin-top: 0.8rem;
  }

  svg path {
    transition: all 0.3s ease-in-out;
  }

  .setting-header {
    width: 100%;
    padding: 3.2rem 2.4rem;

    border-bottom: 0.1rem solid #212830;
  }

  .setting-divider {
    width: 100%;
    height: 0.1rem;
    background-color: #212830;
    opacity: 0.32;

    margin-block: 2.4rem;
  }

  .setting-header p,
  .type-title {
    font-size: 1.8rem;
    line-height: 2.2rem;
  }

  p.type-subtitle {
    color: #88888a;
  }

  .settings-container {
    margin: 3.2rem 0rem 0rem 3.2rem;

    width: 100%;
    max-width: 83.2rem;

    background-color: #0d121a;

    border: 0.1rem solid #212830;
    border-radius: 1.6rem;

    padding: 3.2rem 3.2rem 3.2rem 2.4rem;
  }

  .type-header {
    display: flex;
    flex-direction: column;
    gap: 1.2rem;
  }

  .settings-inputs.notif-inputs {
    display: flex;
    flex-direction: column;
    width: 100%;
    align-items: space-between;
    justify-content: space-between;
  }

  .settings-inputs .notif-item {
    width: 100%;
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 5.6rem;
    font-size: 1.4rem;
  }

  .settings-inputs .notif-description {
    display: flex;
    flex-direction: column;
    gap: 0.8rem;
    font-size: 1.4rem;
  }

  .notif-holder label {
    max-width: 24rem;
  }

  .settings-inputs .notif-title {
    color: #fff;
  }
  .settings-inputs .notif-subtitle {
    color: #88888a;
  }
</style>
