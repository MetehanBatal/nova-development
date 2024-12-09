<script>
	//import { onMount } from 'svelte';

	export let analytics;
	export let fullName;
	export let email;
	export let phone;
	export let shippingAddress;

	// onMount(() => {
	// 	fetch(`https://preconvert.novus.studio/prod/mAnalytics/view?userId=${params.slug}`);
	// });
</script>


<div class="additional-details">
    <div class="section-title">
        Additional Details
    </div>
    <div class="analytics">
        <div class="analytic-item">
            <div class="item-title">
                Email Address
            </div>
            <div class="item-value">
                {email}
            </div>
        </div>
        <div class="analytic-item">
            <div class="item-title">
                User Agent
            </div>
            <div class="item-value">
                {analytics?.browserLocales.browser}/5.0 (iPhone: CPU iPhone OS 16_6 like Mac OS X)
            </div>
        </div>
        <div class="analytic-item">
            <div class="item-title">
                Session ID
            </div>
            <div class="item-value">
                {analytics?.sessionId}
            </div>
        </div>
        <div class="analytic-item">
            <div class="item-title">
                Referrer
            </div>
            <div class="item-value">
                {analytics?.referrer}
            </div>
        </div>
        <div class="analytic-item">
            <div class="item-title">
                UTM Source
            </div>
            <div class="item-value">
                {analytics?.queryParams?.utm_source.length > 0 ? analytics?.queryParams?.utm_source : 'Direct Traffic'}
            </div>
        </div>

        <div class="analytic-item">
            <div class="item-title">
                Country
            </div>
            <div class="item-value">
                {analytics?.country}
            </div>
        </div>

        <div class="analytic-item">
            <div class="item-title">
                Funnel
            </div>
            <div class="item-value">
                {analytics?.funnelName}
            </div>
        </div>

        <div class="analytic-item">
            <div class="item-title">
                Advertorial Page Name
            </div>
            <div class="item-value">
                {analytics?.advertorialPageName || '-'}
            </div>
        </div>

        <div class="analytic-item">
            <div class="item-title">
                Landing Page Name
            </div>
            <div class="item-value">
                {analytics?.landingPageName}
            </div>
        </div>

        <div class="analytic-item">
            <div class="item-title">
                Checkout Page Name
            </div>
            <div class="item-value">
                {analytics?.checkoutPageName}
            </div>
        </div>
    </div>
    <div class="customer-info">
        <div class="analytic-item">
            <div class="item-title">
                Customer
            </div>
            <div class="item-value">
                <div class="customer-value">
                    {fullName}
                </div>
                <div class="customer-item">
                    Statusphere
                </div>
            </div>
        </div>
        <div class="analytic-item">
            <div class="item-title">
                Contact information
            </div>
            <div class="item-value">
                <div class="customer-value">
                    {fullName}
                </div>
                <div class="customer-item">
                    {email}
                </div>
            </div>
        </div>
        <div class="analytic-item">
            <div class="item-title">
                Phone Number
            </div>
            <div class="item-value">
                <div class="customer-value">
                    {phone}
                </div>
            </div>
        </div>
    </div>
</div>



<style>

    .section-title {
        padding: 3.2rem 2.4rem;
        border-block: .1rem solid #1A1F26;

        font-size: 1.6rem;
    }

    .additional-details {
        background-color: #0D121A;
        border-left: .1rem solid #1A1F26;

        width: 100%;
        max-width: 36rem;
    }

    .analytics, .customer-info {
        padding: 2.4rem 3.15rem;

        display: flex;
        flex-direction: column;
        gap: 3.2rem;
        border-bottom: .1rem solid #1A1F26;
    }

    .analytic-item {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: .8rem;
        font-size: 1.4rem;
    }

    .item-value, .customer-item {
        color: #88888A;
    }

    .customer-info .item-value {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: center;
        gap: .8rem
    }

</style>