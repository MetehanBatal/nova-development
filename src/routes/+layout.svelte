<script>
    // Import necessary Svelte and app-specific dependencies
    import { onMount } from 'svelte';
    import { page } from '$app/stores';
	import { toastMessage } from '../stores/toast.js';
    import { user } from '../stores/user';
    import "../css/global.css";

    // Import layout components
    import Sidebar from '$lib/layout/Sidebar.svelte';
    import Header from '$lib/layout/Header.svelte';
	import MobileMenu from '$lib/layout/MobileMenu.svelte';
    import ToastMessage from '$lib/toolkit/ToastMessage.svelte';
    import Notifications from '$lib/toolkit/Notifications.svelte';

    // Get user details from the server
    export let data;
    data = data.userDetails;

    // Notification state management
    let notificationActive = false;
    let messages = [];
    let notificationCount = 0;

    onMount(() => {
        // Update user store with server data if available
        if (data?.user) {
            // Sync local user store with server data
            for (const key in $user) {
                if (data.user.hasOwnProperty(key)) {
                    $user[key] = data.user[key];
                }
            };

            // Initialize notifications
            messages = data.user.notifications;
            
            // Count unread notifications
            for (let i = 0; i < messages.length; i++) {
                if (messages[i].type === "unread") {
                    notificationCount++;
                }
            }
        }
    });
</script>

<!-- Layout structure -->
<!-- Show navigation components except for login/password restore pages -->
{#if $page.route.id !== '/login' && $page.route.id !== '/restore-password' && !$page.error}
    <Sidebar />
	
    <Header {notificationCount} bind:notificationActive={notificationActive}/>
{/if}

<!-- Main content area -->
<main>
    <slot></slot>
</main>

<!-- Toast notifications -->
{#if $toastMessage.content.length > 0}
    <ToastMessage type={$toastMessage.type} content={$toastMessage.content}/>
{/if}

<!-- Mobile menu and notifications -->
<MobileMenu {messages}/>

{#if notificationActive}
<Notifications {messages}/>
{/if}

<style>
    main {
        width: calc(100% - 6.4rem);
    }
</style>