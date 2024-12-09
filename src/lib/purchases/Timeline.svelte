<script>
	import { onMount } from 'svelte';
	import moment from 'moment';

	export let sessionId;
	export let name;

	let events = [];

	onMount(async () => {
        if (sessionId) {
            const eventReq = await fetch(`https://preconvert.novus.studio/prod/mEvents/view?sessionId=${sessionId}`);
            const eventRes = await eventReq.json();
            events = eventRes.data;
        }
	})
</script>

<div class="timeline-wrapper">
    <h2>Timeline</h2>

    <div class="timeline-section">
        <p class="low-text">Today</p>
        
        <div class="timeline-list">
        	{#each events as log, _index}
        	 <div class="timeline-item">
                <div class="item-dot">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
                        <circle cx="9" cy="9" r="8.5" fill="#0D121A" stroke="#383C42"/>
                        <circle cx="9" cy="9" r="4" fill="#383C42"/>
                    </svg>
                </div>
                <div class="timeline-info">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M6.66667 4.16666H3.33333C2.8731 4.16666 2.5 4.53975 2.5 4.99999V8.33332C2.5 8.79356 2.8731 9.16666 3.33333 9.16666H6.66667C7.1269 9.16666 7.5 8.79356 7.5 8.33332V4.99999C7.5 4.53975 7.1269 4.16666 6.66667 4.16666Z" stroke="#383C42" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M2.5 14.1667L4.16667 15.8333L7.5 12.5" stroke="#383C42" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M10.8333 5H17.4999" stroke="#383C42" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M10.8333 10H17.4999" stroke="#383C42" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M10.8333 15H17.4999" stroke="#383C42" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    <p>
                    	{#if log.eventName === 'PageView'}
                        {name} viewed <a href={`https://www.manvsevil.com${log.pageSlug}`}>{log.pageType} page.</a>
                    	{:else if log.eventName === 'AddToCart'}
                        {name} added <strong>{log.productName}</strong> product to their cart.
                        {:else if log.eventName === 'CouponCodeAdded'}
                        {name} used coupon code: <strong>{log.productName}</strong> for <strong>${log.amount}</strong> discount.
                        {:else}
                    	{name} made a purchase of {log.amount.toLocaleString('en-US', {style: 'currency', currency: 'USD'})}.
                    	{/if}
                    </p>
                </div>
                <div class="timeline-date">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M2 8C2 9.18669 2.35189 10.3467 3.01118 11.3334C3.67047 12.3201 4.60754 13.0892 5.7039 13.5433C6.80026 13.9974 8.00666 14.1162 9.17054 13.8847C10.3344 13.6532 11.4035 13.0818 12.2426 12.2426C13.0818 11.4035 13.6532 10.3344 13.8847 9.17054C14.1162 8.00666 13.9974 6.80026 13.5433 5.7039C13.0892 4.60754 12.3201 3.67047 11.3334 3.01118C10.3467 2.35189 9.18669 2 8 2C6.32263 2.00631 4.71265 2.66082 3.50667 3.82667L2 5.33333" stroke="#88888A" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M2 2V5.33333H5.33333" stroke="#88888A" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M8 4.66669V8.00002L10.6667 9.33335" stroke="#88888A" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    <p>
                        {moment(log.timestamp).format('MMM D, YYYY [at] HH:mm A [GMT]Z')}
                    </p>
                </div>
            </div>
            {/each}
        </div>
    </div>
</div>




<style>
    .timeline-wrapper {
        padding-block: 3.2rem;
    }

    .timeline-section {
        font-size: 1.4rem;
        background-color: #0D121A;
        padding: 3.2rem;

        margin-top: 2.4rem;

        border-radius: 1.6rem;

        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: flex-start;
        gap: 2.4rem;
        border: .1rem solid #212830;
    }

    .timeline-list {
        border-radius: 1.6rem;

        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: flex-start;
        gap: 2.4rem;
    }

    .timeline-item {
        position: relative;

        display: flex;
        align-items: center;
        justify-content: flex-start;
        gap: 1.6rem;

        width: 100%;
    }

    .timeline-info {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        gap: .8rem;
        min-width: 50rem;

        border: .1rem solid #1A1F26;
        border-radius: .8rem;

        flex: 1;

        padding: 1.2rem;
    }

    .timeline-date {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: .8rem;
        font-size: 1.2rem;
        color: #88888A;
    }

    .item-dot {
        position: relative;
    } 

    .timeline-item:not(:first-child)::before {
        position: absolute;
        content: "";
        top: 0%;
        left: .85rem;
        height: 50%;
        width: 1px;
        background-color: #383C42;
    }

    .timeline-item:not(:last-child)::after {
        position: absolute;
        content: "";
        top: 50%;
        left: .85rem;
        height: calc(50% + 2.4rem);
        width: 1px;
        background-color: #383C42;
    }

    .timeline-info svg {
        min-width: 2rem;
    }
    .timeline-date svg {
        min-width: 2rem;
    }



    .low-text {
        color: #88888A;
    }

    p a {
    	color: #0091ae;
    	cursor: pointer;
    }
</style>