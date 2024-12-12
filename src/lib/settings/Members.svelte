<script>
  import Dialog from '$lib/toolkit/Dialog.svelte';
  import Input from '$uiKit/components/Input.svelte';
  import Button from '$uiKit/components/Button.svelte';
  import Avatar from '$uiKit/components/Avatar.svelte';

  import { page } from '$app/stores';
  import * as yup from 'yup';
  import Combobox from '$uiKit/components/combobox/Combobox.svelte';
  import { Toast, toaster } from '$uiKit/components/toast/index';

  let dialogResponse = null;

  let emailAddress = '';
  let errors = {
    emailAddress: '',
    selectedMember: ''
  };

  let inProgress = false;

  const spinner = `<div class="lds-spinner"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>`;

  function sendInvite() {
    console.log('selectedMember', selectedMember);
    console.log('memberTypes', memberTypes['key']);

    const apiHeaders = new Headers();
    apiHeaders.append('Content-Type', 'application/x-www-form-urlencoded');

    const urlencoded = new URLSearchParams();
    urlencoded.append('emailAddress', emailAddress);
    urlencoded.append('role', selectedMember.label);
    console.log('urlencoded', urlencoded);

    const requestOptions = {
      method: 'POST',
      headers: apiHeaders,
      body: urlencoded,
      redirect: 'follow'
    };

    inProgress = true;

    fetch('https://mve.novus.studio/prod/users/create', requestOptions)
      .then((response) => response.json())
      .then((result) => {
        inProgress = false;
        console.log('result', result);
        if (result.err && result.err.length > 0) {
          console.log('result.err', result.err);
          toaster.error({
            title: 'Error',
            content: 'Something went wrong while sending invite.',
            duration: 5000
          });
          selectedMember = '';
          emailAddress = '';
        } else {
          toaster.success({
            title: 'Success',
            content: 'Invite sent successfully.',
            duration: 5000
          });
          selectedMember = '';
          emailAddress = '';
        }
      })
      .catch((error) => {
        console.error(error);
        toaster.error({
          title: 'Error',
          content: 'Something went wrong!',
          duration: 5000
        });
        inProgress = false;
      });
  }

  let members = $page.data.membersRes.msg;

  const memberTypes = [
    { key: 'admin', label: 'Admin' },
    { key: 'projectManager', label: 'Project Manager' },
    { key: 'member', label: 'Member' },
    { key: 'editor', label: 'Editor' },
    { key: 'tester', label: 'Tester' }
  ];

  let dialogData = '';
  let dialogModal = false;
  let storedRole;
  let selectedUser;
  let selectedUserOption;

  let selectedMember = '';

  $: if (dialogResponse === 'confirmed') {
    updateRole();
    dialogResponse = null;
  }

  function memberRoleHandler(item, newOption, index) {
    dropdownOpened[index] = false;
    selectedUser = item;
    selectedUserOption = newOption;
    storedRole = item.role;
    dialogModal = true;
    dialogData = {
      icon: '/assets/icons/dialog-icon.svg',
      title: `Are you sure you want to update access?`,
      content: `This will update the priviliges of ${item.firstName}.`,
      confirmText: 'Yes',
      declineText: `Cancel`
    };
  }

  function updateRole() {
    selectedUser.role = selectedUserOption;

    const myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/x-www-form-urlencoded');

    const urlencoded = new URLSearchParams();
    urlencoded.append('emailAddress', selectedUser.emailAddress);
    urlencoded.append('role', selectedUserOption);

    const requestOptions = {
      method: 'PUT',
      headers: myHeaders,
      body: urlencoded,
      redirect: 'follow'
    };

    fetch(`https://mve.novus.studio/prod/users/update?emailAddress=${selectedUser.emailAddress}`, requestOptions)
      .then((response) => response.text())
      .then((result) => {
        if (result.err && result.err.length > 0) {
          toaster.error({
            title: 'Error',
            content: 'Something went wrong while updating User Access.',
            duration: 5000
          });
        } else {
          toaster.success({
            title: 'Success',
            content: 'User type updated successfully. Please Refresh the page.',
            duration: 5000
          });
        }
      })
      .catch((error) => console.error(error));
  }

  let dropdownOpened = Array(memberTypes.length).fill(false);

  function toggleDropdown(index) {
    dropdownOpened[index] = !dropdownOpened[index];
  }

  const schema = yup.object({
    emailAddress: yup.string().email('Invalid email').required('Field is required'),
    selectedMember: yup
      .object()
      .test('is-not-empty', 'Choose  member', (value) => value && Object.keys(value).length > 0)
      .typeError('Choose member')
      .required('Field is required')
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
        emailAddress: emailAddress,
        selectedMember: selectedMember
      };
      try {
        await schema.validate(data, { abortEarly: false });
        errors = {
          emailAddress: '',
          selectedMember: ''
        };
        errors = { ...errors };
        sendInvite();
      } catch (validationErrors) {
        errors = {
          emailAddress: '',
          selectedMember: ''
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
</script>

<div class="settings-container">
  <div class="type-header">
    <p class="type-title">Members</p>
    <p class="type-subtitle">Add members to collaborate within a workspace</p>
  </div>

  <div class="setting-divider"></div>

  <form on:submit|preventDefault={handleSubmit}>
    <div class="settings-input-holder align-center members-holder">
      <label for="inviteEmail"> Invite people to project </label>

      <div class="settings-inputs">
        <Input
          placeholder="Enter email"
          type="text"
          name="inviteEmail"
          bind:value={emailAddress}
          error={errors.emailAddress}
          on:input={(value) => validateForm('emailAddress', value.detail)}
        />

        <Combobox
          name="memberRole"
          items={memberTypes}
          placeholder="Role"
          bind:value={selectedMember}
          error={errors.selectedMember}
          on:selected={(value) => validateForm('selectedMember', value.detail)}
        />
      </div>
    </div>

    <div class="setting-divider"></div>

    <div class="settings-button-wrapper">
      <Button size="small" type="submit">Send Invite</Button>
    </div>
  </form>

  <div class="setting-divider"></div>

  <div class="manage-members">
    <p class="manage-members-title">Manage members</p>
    <div class="members">
      {#each members as member, index}
        <div class="member-item">
          <div class="member-description">
            <div class="member-image">
              <Avatar
                src={member.thumbnail}
                alt={member.firstName}
                placeholder={member.firstName.slice(0, 1)}
                size="xs"
                changeable={false}
              />
            </div>
            <div>
              <p class="member-name">
                {`${member.firstName} ${member.lastName}`}
              </p>
              <p class="member-email">
                {#if member.emailAddress === 'oakinogundeji@gmail.com'}
                  muyiwa@novus.studio
                {:else if member.emailAddress === 'gabriel_scf@hotmail.com'}
                  gabriel@novus.studio
                {:else}
                  {member.emailAddress}
                {/if}
              </p>
              {#if member.firstName === '' || member.lastName === ''}
                <div class="invite-text">Invite pending</div>
              {/if}
            </div>
          </div>
          <Combobox
            name="role"
            items={memberTypes}
            placeholder="Role"
            border={false}
            bind:value={member.role}
            on:selected={(e) => {
              memberRoleHandler(member, e.detail.label, index);
            }}
          ></Combobox>
        </div>
      {/each}

      <div class="setting-divider"></div>
    </div>
  </div>
</div>
<Toast />

{#if dialogModal}
  <Dialog data={dialogData} bind:dialogResponse bind:dialogModal />
{/if}

<style>
  .settings-inputs {
    display: flex;
  }

  .settings-inputs input {
    flex: 1;
  }

  :global(.settings-inputs .dropdown .dropdown-title) {
    background-color: transparent;
  }

  :global(.settings-inputs .dropdown.active .dropdown-title) {
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
  }

  .manage-members {
    align-items: flex-start;
    gap: 2.4rem;
  }

  .manage-members-title {
    flex: 1;
  }

  .members {
    flex: 2;
    max-width: 51rem;
    margin-left: auto;
  }

  .member-item {
    padding: 1.6rem 1.6rem 1.6rem 0.8rem;

    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    align-items: center;
    justify-content: space-between;

    border-bottom: 0.1rem solid rgba(33, 40, 48, 1);
  }

  .member-description {
    display: grid;
    grid-template-columns: 0.1fr 1fr 1fr;
    align-items: center;
  }

  .member-image img {
    border-radius: 50%;
  }

  .member-image {
    width: 4rem;
    height: 4rem;

    grid-row-start: 1;
    grid-row-end: 3;

    display: flex;
    align-items: center;
    justify-content: center;

    background-color: #aa96f3;

    padding: 0.6rem;
    margin-right: 0.8rem;

    font-size: 1.4rem;
    line-height: 1.8rem;

    border-radius: 50%;
  }

  .member-item:first-child .member-image {
    background-color: #161616;
  }

  .member-name {
    grid-row-start: 1;
  }
  .member-email {
    grid-row-start: 2;
    font-size: 1.2rem;
    color: #88888a;

    display: flex;
  }

  :global(.status-dropdown .dropdown-selection) {
    background-color: transparent !important;
    border: none !important;
  }

  :global(.status-dropdown .dropdown-selection p) {
    font-size: 1.2rem;
  }

  :global(.status-dropdown .dropdown p) {
    font-size: 1.2rem;
  }

  .invite-text {
    padding: 0.2rem 0.4rem;
    border-radius: 0.4rem;
    font-size: 1rem;
    display: block;
    white-space: pre;
    background: #88888a;
    color: #fff;
    line-height: 1rem;
    height: fit-content;
    margin-left: 0.5rem;
    width: fit-content;
  }

  .cta-button {
    min-width: 13.7rem;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .dropdown-box {
    position: relative;
  }

  .dropdown-selection {
    display: flex;
    align-items: center;
    gap: 1.4rem;

    background-color: #0d121a;
    border: 0.1rem solid #383c42;
    border-radius: 0.8rem;

    padding: 1rem 1.2rem;

    width: max-content;

    cursor: pointer;
  }

  .dropdown-selection svg {
    transition: transform 0.24s ease-in-out;
  }

  .dropdown-selection.opened svg {
    transform: rotate(180deg);
  }

  .dropdown {
    position: absolute;
    top: 100%;
    right: 0;

    width: max-content;

    background-color: #0d121a;
    border: 0.1rem solid #383c42;
    border-radius: 0.8rem;

    padding: 0.8rem 0;

    transform: translateY(0.4rem);
    z-index: 100;
  }

  .dropdown.left {
    left: 0;
    right: auto;
  }

  .dropdown-option {
    display: flex;
    align-items: center;
    gap: 0.8rem;

    width: 100%;

    padding: 1.2rem 1rem;

    transition: all 0.24s ease-in-out;
    cursor: pointer;
  }

  .dropdown-option:hover {
    background-color: rgba(33, 40, 48, 0.4);
  }

  .dropdown-option.selected {
    background-color: #212830;
  }

  .dropdown-option svg {
    margin-left: auto;

    opacity: 0;
  }

  .dropdown-option.selected svg {
    opacity: 1;
  }

  .option-content {
    display: flex;
    align-items: center;
    gap: 0.8rem;
  }

  .option-content p {
    white-space: nowrap;
  }

  :global(.members-holder .dropdown-box, .members-holder .dropdown-selection, .members-holder .dropdown) {
    width: 100% !important;
    max-width: 25rem;
  }

  :global(.members-holder .dropdown-box .dropdown-selection) {
    justify-content: space-between;
  }
</style>
