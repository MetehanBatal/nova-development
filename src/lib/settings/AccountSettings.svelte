<script>
  import { organization } from '$stores/organization';
  import Title from '$uiKit/components/Title.svelte';
  import Input from '$uiKit/components/Input.svelte';
  import Button from '$uiKit/components/Button.svelte';
  import Combobox from '$uiKit/components/combobox/Combobox.svelte';
  import Choicebox from '$uiKit/components/Choicebox.svelte';
  import FileUploader from '$uiKit/components/FileUploader.svelte';
  import Avatar from '$uiKit/components/Avatar.svelte';
  import * as yup from 'yup';

  let imgElement;
  let file;
  let loadedData = 'https://www.manvsevil.m'; // Should be change after create db.
  let loadedName;

  let inProgress = false;

  const memberTypes = [
    { key: 'admin', label: 'Admin' },
    { key: 'projectManager', label: 'Project Manager' },
    { key: 'member', label: 'Member' },
    { key: 'editor', label: 'Editor' },
    { key: 'tester', label: 'Tester' }
  ];
  const choiceboxItems = [
    { value: 0, label: 'Use Initial' },
    { value: 1, label: 'Upload an image' }
  ];
  let defaultRoleKey = { key: 'member', label: 'Member' };
  let attachmentAccessKey = {};
  let projectAccessKey = {};
  let aiSuggestion = false;

  let avatarSelection = 1;
  let errors = {
    slug: '',
    displayName: '',
    defaultRoleKey: '',
    attachmentAccessKey: '',
    projectAccessKey: ''
  };

  /*

    function saveGeneralSettings () {
        inProgress = true;
        loadedName = fileInput.files[0].name;
        loadedData = fileInput.files[0].size / 1048576;

        const reader = new FileReader();
        reader.onload = function (e) {
        const imageSrc = e.target.result;
            imgElement.src = imageSrc;
        };

        reader.readAsDataURL(fileInput.files[0]);

        const formdata = new FormData();
        formdata.append("file", fileInput.files[0], Date.now());

        const requestOptions = {
            method: "POST",
            body: formdata,
            redirect: "follow"
        };

        fetch("https://mve.novus.studio/prod/users/uploadPhoto", requestOptions)
            .then((response) => response.json())
            .then((result) => {
                inProgress = false;
                if (result.err && result.err.length > 0) {
                    $toastMessage.type = "error";
                    $toastMessage.content = 'Something went wrong while updating brand image.'
                } else {
                    $toastMessage.type = "success";
                    $toastMessage.content = "Image updated successfully.";
                }

                setTimeout(() => {
                    $toastMessage.type = "";
                    $toastMessage.content = "";
                },5000)
            })
            .catch((error) => console.error(error));
    }

    */

  const firstSchema = yup.object({
    slug: yup.string().required('Organization Slug is required'),
    displayName: yup.string().required('Display Name is required')
  });

  const validateFormFirstForm = async (fieldName, value, values) => {
    if (fieldName) {
      try {
        const fieldSchema = yup.reach(firstSchema, fieldName);
        await fieldSchema.validate(value);
        errors[fieldName] = '';
      } catch (validationErrors) {
        console.log(`Validation error for "${fieldName}":`, validationErrors.message);
        errors[fieldName] = validationErrors.message;
      }
    } else {
      try {
        await firstSchema.validate(values, { abortEarly: false });
        errors = {
          slug: '',
          displayName: '',
          defaultRoleKey: '',
          attachmentAccessKey: '',
          projectAccessKey: ''
        };
      } catch (validationErrors) {
        errors = {
          slug: '',
          displayName: '',
          defaultRoleKey: '',
          attachmentAccessKey: '',
          projectAccessKey: ''
        };
        console.log('Validation errors:', validationErrors.inner);
        validationErrors.inner.forEach((err) => {
          errors[err.path] = err.message;
        });
      }
    }
  };

  const handleSubmitFirstForm = async (event) => {
    event.preventDefault();

    const form = event.target;
    const formData = new FormData(form);
    const values = Object.fromEntries(formData.entries());

    await validateFormFirstForm(null, null, values);

    if (Object.keys(errors).length === 0) {
      console.log('Form is valid! Proceeding with submission...');
    } else {
      console.log('Form has errors:', errors);
    }
  };

  function handleFile(event) {
    file = event.detail.src;
  }

  const secondSchema = yup.object({
    defaultRoleKey: yup
      .object()
      .test('is-not-empty', 'Choose default role', (value) => value && Object.keys(value).length > 0)
      .typeError('Choose default role')
      .required('Field is required'),
    attachmentAccessKey: yup
      .object()
      .test('is-not-empty', 'Choose attachment access', (value) => value && Object.keys(value).length > 0)
      .typeError('Choose attachment access')
      .required('Field is required'),
    projectAccessKey: yup
      .object()
      .test('is-not-empty', 'Choose project access', (value) => value && Object.keys(value).length > 0)
      .typeError('Choose project access')
      .required('Field is required')
  });

  const validateFormSecondForm = async (fieldName, value) => {
    if (fieldName) {
      try {
        const fieldSchema = yup.reach(secondSchema, fieldName);
        await fieldSchema.validate(value);
        errors[fieldName] = '';
      } catch (validationErrors) {
        console.log(`Validation error for "${fieldName}":`, validationErrors.message);
        errors[fieldName] = validationErrors.message;
      }
    } else {
      try {
        const data = {
          defaultRoleKey,
          attachmentAccessKey,
          projectAccessKey
        };
        await secondSchema.validate(data, { abortEarly: false });
        errors = {
          slug: '',
          displayName: '',
          defaultRoleKey: '',
          attachmentAccessKey: '',
          projectAccessKey: ''
        };
        console.log('Form is valid! Proceeding with submission...');
      } catch (validationErrors) {
        errors = {
          slug: '',
          displayName: '',
          defaultRoleKey: '',
          attachmentAccessKey: '',
          projectAccessKey: ''
        };
        console.log('Validation errors:', validationErrors.inner);
        validationErrors.inner.forEach((err) => {
          errors[err.path] = err.message;
        });
      }
    }
  };

  const handleSubmitSecondForm = async (event) => {
    event.preventDefault();
    await validateFormSecondForm(null, null);

    if (Object.keys(errors).length === 0) {
      console.log('Form is valid! Proceeding with submission...');
      // todo
    } else {
      console.log('Form has errors:', errors);
    }
    console.log('event', event);
  };

  $: aiSuggestion, console.log('AI Suggestion', aiSuggestion);
  $: $organization, console.log('Organization', $organization);
</script>

<form class="settings-container" on:submit|preventDefault={handleSubmitFirstForm}>
  <div class="settings-group">
    <div>
      <Title size="md" title="Organization Slug" description="A unique ID used to identify this organization." />
    </div>
    <Input
      name="slug"
      error={errors.slug}
      bind:value={$organization.slug}
      on:input={(value) => validateFormFirstForm('slug', value.detail)}
    />
  </div>

  <div class="setting-divider"></div>

  <div class="settings-group">
    <div>
      <Title size="md" title="Display Name" description="A human-friendly name for the organization." />
    </div>

    <Input
      name="displayName"
      error={errors.displayName}
      bind:value={$organization.displayName}
      on:input={(value) => validateFormFirstForm('displayName', value.detail)}
    />
  </div>

  <div class="setting-divider"></div>

  <div>
    <Title
      size="md"
      title="AI-suggested Solution"
      description="Opt-in to AI suggested solution to get help on how to solve an issue."
      isChoice={true}
      on:toggle={(event) => (aiSuggestion = event.detail)}
    />
  </div>

  <div class="setting-divider"></div>

  <div class="settings-button-wrapper">
    <Button size="small" type="submit">Save Changes</Button>
  </div>
</form>

<form class="settings-container" on:submit|preventDefault={handleSubmitSecondForm}>
  <div class="settings-group">
    <div>
      <Title size="md" title="Default Role" description="The default role new member will receive." />
    </div>

    <Combobox
      name="defaultRoleKey"
      error={errors.defaultRoleKey}
      type="select"
      items={memberTypes}
      placeholder="Default Role"
      bind:value={defaultRoleKey}
      on:selected={(value) => validateFormSecondForm('defaultRoleKey', value.detail)}
    />
  </div>

  <div class="setting-divider"></div>

  <div class="settings-group">
    <div>
      <Title size="md" title="Attachments Access" description="Role required to export the events and reports." />
    </div>
    <Combobox
      name="attachmentAccessKey"
      error={errors.attachmentAccessKey}
      type="select"
      items={memberTypes}
      placeholder="Attachment access"
      bind:value={attachmentAccessKey}
      on:selected={(value) => validateFormSecondForm('attachmentAccessKey', value.detail)}
    />
  </div>

  <div class="setting-divider"></div>

  <div class="settings-group">
    <div>
      <Title size="md" title="Project Access" description="Role required to access the subsequent projects." />
    </div>
    <Combobox
      name="projectAccessKey"
      error={errors.projectAccessKey}
      type="select"
      items={memberTypes}
      placeholder="Project access"
      bind:value={projectAccessKey}
      on:selected={(value) => validateFormSecondForm('projectAccessKey', value.detail)}
    />
  </div>

  <div class="setting-divider"></div>

  <div class="settings-group">
    <div>
      <Title size="md" title="Avatar" />

      <div>
        <Choicebox
          items={choiceboxItems}
          name="avatar"
          isBorderVisible={false}
          direction="column"
          bind:radioSelected={avatarSelection}
        />
      </div>
    </div>

    {#if avatarSelection === 0}
      <div class="thumbnail-wrapper">
        <img bind:this={imgElement} class="thumbnail" src={$organization.thumbnail} />
      </div>
    {:else}
      <div class="thumbnail-wrapper">
        {#if file}
          <Avatar src={file} placeholder="Avatar" on:fileChange={handleFile} />
        {/if}

        <FileUploader on:file={handleFile} />
      </div>
    {/if}
  </div>

  <div class="setting-divider"></div>

  <div class="settings-button-wrapper">
    <Button size="small" type="submit">Save Changes</Button>
  </div>
</form>

<style>
  .settings-group {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
  }

  h3 {
    font-size: 1.8rem;
    line-height: 2.2;
  }

  .input {
    padding-left: 1.2rem;

    width: 100%;
    max-width: 25rem;
  }

  .radio-button {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    gap: 1rem;

    padding: 1.3rem 1rem;
  }

  .radio-button .checkbox {
    position: relative;

    width: 1.6rem;
    height: 1.6rem;

    border: 0.1rem solid rgba(136, 136, 138, 1);

    border-radius: 50%;

    cursor: pointer;
  }

  .radio-button.active .checkbox::after {
    content: '';

    width: 0.6rem;
    height: 0.6rem;

    position: absolute;
    top: 50%;
    left: 50%;

    transform: translate3d(-50%, -50%, 0);

    background-color: rgba(136, 136, 138, 1);

    border-radius: 50%;
  }

  .thumbnail-wrapper {
    position: relative;

    margin-block: auto;
    display: flex;
    gap: 3.6rem;
    align-items: center;
  }

  :global(.settings-group .dropdown-box, .settings-group .dropdown-selection, .settings-group .dropdown) {
    width: 100% !important;
    max-width: 25rem;
  }

  :global(.settings-group .dropdown-box .dropdown-selection) {
    justify-content: space-between;
  }

  .thumbnail-overlay {
    position: absolute;
    top: 0;
    left: 0;

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    width: 100%;
    height: 100%;

    opacity: 1;
    background-color: rgba(0, 0, 0, 0.8);

    z-index: 1000;
    transition: all 0.3s ease-in-out;
    cursor: pointer;
  }

  .thumbnail-overlay p {
    font-size: 1.4rem;
    color: #ffffff;
  }

  .thumbnail-overlay img {
    width: 2.4rem;
    height: 2.4rem;
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease-in-out;
    margin-block: 0;
  }

  .thumbnail-overlay:hover img {
    visibility: visible;
    opacity: 1;
  }

  .thumbnail-changer {
    width: 100%;
    height: 100%;
    background-color: transparent;
  }
</style>
