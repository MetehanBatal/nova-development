<script>
    import moment from "moment";
    import { onMount } from "svelte";


    let activeTab = "All";


    export let messages;

    let unreadedLength = messages.filter(message => message.seen === false).length;

    function markAll () {
        messages.forEach(item => {
            item.type = "readed";
        });

        activeTab = "All";

        unreadedLength = 0;
    }
</script>





<div class="notification-wrapper">

    <div class="notification-header">
        <div class="notification-top">
            <p class="notification-title">Notifications</p>
            <p class="mark-all" on:click={() => markAll()}>Mark all as read</p>
        </div>

        <div class="notification-tabs">
            <div class="notification-tab-item" on:click={() => activeTab = "All"} class:active={activeTab === "All"}>All <div class="notification-count">{messages.length}</div></div>
            <div class="notification-tab-item" on:click={() => activeTab = "Not Seen"} class:active={activeTab === "Unread"}>Not Read <div class="notification-unread-count">{unreadedLength}</div></div>
        </div>

        <div class="notifications">
            {#if activeTab === "Not Seen"}
            {#each messages as notificationItem, index}
                {#if notificationItem.type === "unread"}
                    <div class="notification-item">
                            <div class="not-read-circle" class:not-read={notificationItem.type === "unread"}></div>
                        <div class="notification-description">
                            <div class="notification-item-title">
                                {notificationItem.title}
                                <img src="/assets/icons/trash-notification-icon.svg" alt="">
                            </div>
                            <p class="notification-item-description">{notificationItem.content}</p>
                            <p class="notification-item-user">{notificationItem.initiator} <span>●</span> {notificationItem.timestamp}</p>
                        </div>                
                    </div>
                {/if}
            {/each}

            {:else}

            {#each messages as notificationItem , index}
                <div class="notification-item">
                        <div class="not-read-circle" class:not-read={notificationItem.type === "unread"}></div>
                    <div class="notification-description">
                        <div class="notification-item-title">
                            {notificationItem.title}
                            <img src="/assets/icons/trash-notification-icon.svg" alt="">
                        </div>
                        <p class="notification-item-description">{@html notificationItem.content}</p>
                        <p class="notification-item-user">{notificationItem.initiator} <span>●</span>
                            {moment(notificationItem.timestamp).format('D MMM h:mmA')}
                        </p>
                    </div>                
                </div>
            {/each}
       {/if} 
        </div>
    </div>

</div>




<style>

    .notification-wrapper {

        width: 100%;
        max-width: 38rem;

        position: fixed;
        top: 7.2rem;
        right: 2.4rem;

        background-color: rgba(13, 18, 26, 1);
        

        border: .1rem solid rgba(33, 40, 48, 1);

        border-radius: 1.6rem;
    }

    .notification-top {
        display: flex;
        align-items: center;
        justify-content: space-between;

        padding: 2.1rem 2.4rem 0rem 1.6rem;
    }

    .notification-tabs {
        display: grid;
        grid-template-columns: 1fr 1fr;
    }

    .notification-title {
        font-size: 1.8rem;
        line-height: 2.2rem;

        font-weight: 500;

        color: rgba(255, 255, 255, 1);
    }

    .mark-all {
        font-size: 1.4rem;
        line-height: 1.8rem;
        text-decoration: underline;

        color: rgba(255, 255, 255, 1);

        cursor: pointer;
    }

    .notification-tab-item {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: .8rem;

        padding-block: 2.4rem;

        font-size: 1.6rem;
        line-height: 2rem;

        cursor: pointer;

        border-bottom: .1rem solid transparent;
    }

    .notification-tab-item.active {
        border-bottom: .1rem solid rgba(136, 136, 138, 1);
    }

    .notification-count {
        padding: .2rem .8rem;

        font-size: 1.2rem;
        line-height: 1.6rem;

        background-color: rgba(33, 40, 48, 1);
    }
    .notification-unread-count {
        padding: .2rem .8rem;

        font-size: 1.2rem;
        line-height: 1.6rem;

        background-color: rgba(243, 115, 97, 1);
    }

    .notification-description {
        width: 100%;
    }

    .notification-item {
        display: flex;
        align-items: flex-start;
        justify-content: flex-start;
        gap: 1.2rem;

        padding: 2rem 1.5rem;

        border-bottom: .1rem solid rgba(33, 40, 48, 1);
        transition: all .3s ease-in-out;

        cursor: pointer;
    }

    .notification-item:hover {
        background-color: rgba(33, 40, 48, 1);
    }

    .notification-item-user span {
        font-size: .8rem;
    }

    .notification-item-title {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        font-size: 1.4rem;
        line-height: 1.8rem;

        margin-bottom: 1.1rem;

        color: rgba(255, 255, 255, 1);
    }

    .notification-item-title img {
        width: 2rem;   
        height: 2rem;   
    }

    .notification-item-description {
        font-size: 1.4rem;
        line-height: 1.8rem;

        color: rgba(136, 136, 138, 1);

        margin-bottom: .4rem;
    }

    .notification-item-user {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        gap: .8rem;

        font-size: 1.4rem;
        line-height: 1.8rem;

        color: rgba(136, 136, 138, 1);
    }

    .not-read-circle {
        min-width: 1.4rem;   
        width: 1.4rem;
        min-height: 1.4rem;   
        height: 1.4rem;   

        border-radius: 50%;

        background-color: rgba(136, 136, 138, 1);
    }

    .not-read-circle.not-read {
        background-color: rgba(170, 150, 243, 1);
    }

    .notifications {
        max-height: 57rem;
        overflow-y: scroll;
    }

    .notifications .notification-item:last-child {
        border-bottom: none;
    }

</style>