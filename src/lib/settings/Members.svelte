<script>
    import Dropdown from '$lib/toolkit/Dropdown.svelte';
    import Dialog from '$lib/toolkit/Dialog.svelte';
    
    import { page } from '$app/stores';
    import { toastMessage } from '../../stores/toast';
    
    let dialogResponse;
    
    
    let emailAddress = "";
    
    let inProgress = false;
    
    const spinner = `<div class="lds-spinner"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>`;
    
    function sendInvite() {
        if (emailAddress.length < 1 || memberTypes[selectedMemberTypesIndex]["name"] === 'Membership Status') {
            $toastMessage.type = "warning";
            $toastMessage.content = "Please enter a valid email address";
            inProgress = false;
    
            return;
        }
        
        const apiHeaders = new Headers();
        apiHeaders.append("Content-Type", "application/x-www-form-urlencoded");
    
        const urlencoded = new URLSearchParams();
        urlencoded.append("emailAddress", emailAddress);
        urlencoded.append("role", memberTypes[selectedMemberTypesIndex]["name"]);
    
    
        const requestOptions = {
            method: "POST",
            headers: apiHeaders,
            body: urlencoded,
            redirect: "follow"
        };
    
        inProgress = true;
    
        fetch("https://preconvert.novus.studio/prod/users/create", requestOptions)
            .then((response) => response.json())
            .then((result) => {
                inProgress = false;
                if (result.err && result.err.length > 0) {
                    $toastMessage.type = "error";
                    $toastMessage.content = 'Something went wrong while sending invite.'				
                } else {
                    $toastMessage.type = "success";
                    $toastMessage.content = "Invite sent successfully.";				
                }
            })
            .catch((error) => {
                 console.error(error)
                $toastMessage.type = "error";
                $toastMessage.content = "Something Went Wrong!";
                inProgress = false;
    
                setTimeout(() => {
                    $toastMessage.type = "";
                    $toastMessage.content = "";
                },5000)
            });
    }
    
    
    let members = $page.data.membersRes.msg;
    
    const memberTypes = [
        { id: 'admin', name: 'Admin'},
        { id: 'projectManager', name: 'Project Manager' },
        { id: 'member', name: 'Member' },
        { id: 'editor', name: 'Editor' },
        { id: 'tester', name: 'Tester' }
    ];
    
    let dialogData = '';
    let dialogModal = false;
    let storedRole;
    let selectedUser;
    let selectedUserOption;
    
    let selectedMemberTypesIndex = 0;
    
    $: if (dialogResponse === 'confirmed') {
        updateRole();
    }
    
    function memberRoleHandler(item, newOption, index) {	
            dropdownOpened[index] = false
            selectedUser = item;
            selectedUserOption = newOption;
            storedRole = item.role;
            dialogModal = true;
            dialogData = {
                icon: '/assets/icons/dialog-icon.svg',
                title: `Are you sure you want to update access?`,
                content: `This will update the priviliges of ${item.firstName}.`,
                confirmText: "Yes",
                declineText: `Cancel`
            }  
    }
    
    function updateRole() {
        selectedUser.role = selectedUserOption;
    
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
    
        const urlencoded = new URLSearchParams();
        urlencoded.append("emailAddress", selectedUser.emailAddress);
        urlencoded.append("role", selectedUserOption);
    
        const requestOptions = {
            method: "PUT",
            headers: myHeaders,
            body: urlencoded,
            redirect: "follow",
        };
    
        fetch(
            `https://preconvert.novus.studio/prod/users/update?emailAddress=${selectedUser.emailAddress}`,
            requestOptions
        )
            .then((response) => response.text())
            .then((result) => {
                if (result.err && result.err.length > 0) {
                    $toastMessage.type = "error";
                    $toastMessage.content = 'Something went wrong while updating User Access.'				
                } else {
                    $toastMessage.type = "success";
                    $toastMessage.content = "User type updated succesfully. Please Refresh the page.";				
                }
            })
            .catch((error) => console.error(error));
    }
    
    
    
    let dropdownOpened = Array(memberTypes.length).fill(false);
    
    function toggleDropdown(index) {
        dropdownOpened[index] = !dropdownOpened[index];
    }
    
</script>


<div class="settings-container">

    <div class="type-header">
        <p class="type-title">Members</p>
        <p class="type-subtitle">Add members to collaborate within a workspace</p>
    </div>

    <div class="setting-divider"></div>

    <div class="settings-input-holder align-center members-holder">
        <label for="inviteEmail">
            Invite people to project
        </label>
        
        <div class="settings-inputs">
            <input type="text" name="inviteEmail" placeholder="Enter email" bind:value={emailAddress}>

            <Dropdown options={memberTypes} bind:selectedStatusIndex={selectedMemberTypesIndex} position="left"/>
        </div>
    </div>

    <div class="setting-divider"></div>

    <div class="settings-button-wrapper">
        <div class="cta-button primary" on:click={(e) => sendInvite()}>
            {#if inProgress}
            {@html spinner}
            {:else}
            Send Invite
            {/if}
        </div>
    </div>

    <div class="setting-divider"></div>

    <div class="manage-members">
        <p class="manage-members-title">
            Manage members
        </p>
        <div class="members">
            
            {#each members as member, index}
                <div class="member-item">
                <div class="member-description">
                    <div class="member-image">
                        {#if member.thumbnail}
                            <img src={`${member.thumbnail}`} alt="">
                            {:else}
                            {member.firstName.slice(0,1)}
                        {/if}
                    </div>
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
                        
                        {#if member.firstName === "" || member.lastName === ""}
                            <div class="invite-text">
                                Invite pending
                            </div>
                        {/if}
                    </p>
                </div>
                <div class="status-dropdown">				

                    <div class="dropdown-box">
                        <div class="dropdown-selection" on:click={(e) => { toggleDropdown(index) }}>
                            <div class="option-content">
                                <p>{member.role}</p>
                            </div>
                    
                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M3.5 5.25L7 8.75L10.5 5.25" stroke="white" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </div>
                    
                        {#if dropdownOpened[index]}
                        <div class={`dropdown left`}>
                            {#each memberTypes as option, _index}
                            <div class="dropdown-option" class:selected={option.name.toLowerCase() === member.role.toLowerCase() } on:click={(e) => {memberRoleHandler(member, option.name, index)}}>
                                <div class="option-content">
                                    <p>{option['name']}</p>
                                </div>

                                {#if option["icon"]}
                                    <img width="16" height="16" src={option['icon']} alt={option['name']}>
                                {/if}
                    
                                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M10 3L4.5 8.5L2 6" stroke="white" stroke-linecap="round" stroke-linejoin="round"/>
                                </svg>
                            </div>
                            {/each}
                        </div>
                        {/if}
                    </div>
                </div>
                
            </div>
            {/each}
            

            <div class="setting-divider"></div>
        </div>
    </div>

</div>

{#if dialogModal}
    <Dialog data={dialogData} bind:dialogResponse={dialogResponse} bind:dialogModal={dialogModal} />
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
        display: flex;
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
        padding: 1.6rem 1.6rem 1.6rem .8rem;

        display: flex;
        align-items: center;
        justify-content: space-between;

        border-bottom: .1rem solid rgba(33, 40, 48, 1);
    }

    .member-description {
        display: grid;
        grid-template-columns: .1fr 1fr 1fr;
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

        background-color: #AA96F3;

        padding: .6rem;
        margin-right: .8rem;

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
        color: #88888A;

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
        padding: .2rem .4rem;
        border-radius: .4rem;
        font-size: 1rem;
        display: block;
        white-space: pre;
        background: #88888A;
        color: #FFF;
        line-height: 1rem;
        height: fit-content;
        margin-left: .5rem;
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

        background-color: #0D121A;
        border: .1rem solid #383C42;
        border-radius: .8rem;

        padding: 1rem 1.2rem;

        width: max-content;

        cursor: pointer;
    }

    .dropdown-selection svg {
        transition: transform .24s ease-in-out;
    }

    .dropdown-selection.opened svg {
        transform: rotate(180deg);
    }

    .dropdown {
        position: absolute;
        top: 100%;
        right: 0;

        width: max-content;

        background-color: #0D121A;
        border: .1rem solid #383C42;
        border-radius: .8rem;

        padding: .8rem 0;

        transform: translateY(.4rem);
        z-index: 100;
    }

    .dropdown.left {
        left: 0;
        right: auto;
    }

    .dropdown-option {
        display: flex;
        align-items: center;
        gap: .8rem;

        width: 100%;

        padding: 1.2rem 1rem;

        transition: all .24s ease-in-out;
        cursor: pointer;
    }

    .dropdown-option:hover {
        background-color: rgba(33, 40, 48, .4);
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
        gap: .8rem;
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