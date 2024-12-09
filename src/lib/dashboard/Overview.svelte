<script>
    import {onMount} from 'svelte';
    
    import Chart from '$lib/Charts/Chart.svelte';
    
    const spinner = `<div class="lds-spinner"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>`;
    
    let users = [];
    let purchases = [];
    let totalAmounts = [];
    
    onMount(() => {
        console.time('fetchStart');
        const requestOptions = {
            method: "GET",
            redirect: "follow"
        };
    
        var currentDate = new Date().getTime();
    
        var oneWeekAgo = currentDate - (7 * 24 * 60 * 60 * 1000);
        var twoWeeksAgo = currentDate - (14 * 24 * 60 * 60 * 1000);
    
        fetch(`https://preconvert.novus.studio/prod/mAnalytics/dashboard?funnel=kit&event=PageView&comparison=${twoWeeksAgo}&startDate=${oneWeekAgo}&endDate=${currentDate}&accuracy=day`, requestOptions)
            .then((response) => response.json())
            .then((result) => {
                users[0] = result.analytics.present.reduce((acc, usersByDay) => acc + usersByDay.value, 0);
                users[1] = result.analytics.past.reduce((acc, usersByDay) => acc + usersByDay.value, 0);
            })
            .catch((error) => console.error(error));
    
        fetch(`https://preconvert.novus.studio/prod/mAnalytics/dashboard?funnel=kit&event=Purchase&comparison=${twoWeeksAgo}&startDate=${oneWeekAgo}&endDate=${currentDate}&accuracy=day`, requestOptions)
            .then((response) => response.json())
            .then((result) => {
                purchases[0] = result.analytics.present.reduce((acc, purchasesByDay) => acc + purchasesByDay.uniquePurchases, 0);
                totalAmounts[0] = result.analytics.present.reduce((acc, purchasesByDay) => acc + purchasesByDay.totalAmount, 0);
                purchases[1] = result.analytics.past.reduce((acc, purchasesByDay) => acc + purchasesByDay.uniquePurchases, 0);
                totalAmounts[1] = result.analytics.past.reduce((acc, purchasesByDay) => acc + purchasesByDay.totalAmount, 0);
            })
            .catch((error) => console.error(error));
    
    })
</script>

<div class="overview-container">
    <div class="overview-card">
        <div class="overview-header">
            <div class="overview-type">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M10.6693 14V12.6667C10.6693 11.9594 10.3883 11.2811 9.88822 10.781C9.38812 10.281 8.70985 10 8.0026 10H4.0026C3.29536 10 2.61708 10.281 2.11699 10.781C1.61689 11.2811 1.33594 11.9594 1.33594 12.6667V14" stroke="white" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M6.0026 7.33333C7.47536 7.33333 8.66927 6.13943 8.66927 4.66667C8.66927 3.19391 7.47536 2 6.0026 2C4.52984 2 3.33594 3.19391 3.33594 4.66667C3.33594 6.13943 4.52984 7.33333 6.0026 7.33333Z" stroke="white" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M14.6641 13.9998V12.6664C14.6636 12.0756 14.467 11.5016 14.105 11.0346C13.743 10.5677 13.2361 10.2341 12.6641 10.0864" stroke="white" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M10.6641 2.08643C11.2377 2.23329 11.7461 2.56689 12.1092 3.03463C12.4722 3.50237 12.6693 4.07765 12.6693 4.66976C12.6693 5.26187 12.4722 5.83715 12.1092 6.30488C11.7461 6.77262 11.2377 7.10622 10.6641 7.25309" stroke="white" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <p class="overview-name">Users</p>
            </div>
            <div class="tooltip-wrapper">
                <div class="tooltip-content">
                    Compared to last week
                </div>
                <div>
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
                        <path d="M8.99609 16.5005C13.1382 16.5005 16.4961 13.1426 16.4961 9.00049C16.4961 4.85835 13.1382 1.50049 8.99609 1.50049C4.85396 1.50049 1.49609 4.85835 1.49609 9.00049C1.49609 13.1426 4.85396 16.5005 8.99609 16.5005Z" stroke="white" stroke-opacity="0.24" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M9 12V9" stroke="white" stroke-opacity="0.24" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M9 6.00024H9.0075" stroke="white" stroke-opacity="0.24" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </div>
            </div>
        </div>
        <div class="overview-content">
            <div class="overview-number">
                {#if users.length > 1}
                {users[0]}
                {:else}
                {@html spinner}
                {/if}
            </div>
            {#if users.length > 1}
            <div class="overview-percentage down-metric">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M11.7828 9.44971L7.29115 4.95804L4.95781 7.29137L1.63281 3.96637" stroke="#060B13" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M8.75 9.91681H12.25V6.41681" stroke="#060B13" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <span>{(( (users[0] / users[1]) - 1 ) * 100).toFixed(2)}%</span>
            </div>
            {/if}
        </div>
    </div>
    <div class="overview-card">
        <div class="overview-header">
            <div class="overview-type">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M8.66927 2H2.66927C2.31565 2 1.97651 2.14048 1.72646 2.39052C1.47641 2.64057 1.33594 2.97971 1.33594 3.33333V10C1.33594 10.3536 1.47641 10.6928 1.72646 10.9428C1.97651 11.1929 2.31565 11.3333 2.66927 11.3333H13.3359C13.6896 11.3333 14.0287 11.1929 14.2787 10.9428C14.5288 10.6928 14.6693 10.3536 14.6693 10V8" stroke="white" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M5.33594 14H10.6693" stroke="white" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M8 11.3334V14" stroke="white" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M11.3359 5.33333L14.6693 2" stroke="white" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M11.3359 2H14.6693V5.33333" stroke="white" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <p class="overview-name">Total Revenue</p>
            </div>
            <div class="tooltip-wrapper">
                <div class="tooltip-content">
                    Compared to last week
                </div>
                <div>
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
                        <path d="M8.99609 16.5005C13.1382 16.5005 16.4961 13.1426 16.4961 9.00049C16.4961 4.85835 13.1382 1.50049 8.99609 1.50049C4.85396 1.50049 1.49609 4.85835 1.49609 9.00049C1.49609 13.1426 4.85396 16.5005 8.99609 16.5005Z" stroke="white" stroke-opacity="0.24" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M9 12V9" stroke="white" stroke-opacity="0.24" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M9 6.00024H9.0075" stroke="white" stroke-opacity="0.24" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </div>
            </div>
        </div>
        <div class="overview-content">
            <div class="overview-number">
                {#if totalAmounts.length > 1}
                {(totalAmounts[0]).toLocaleString('en-US', {style: 'currency', currency: 'USD'})}
                {:else}
                {@html spinner}
                {/if}
            </div>
            {#if totalAmounts.length > 1}
            <div class="overview-percentage down-metric">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M11.7828 4.55029L7.29115 9.04196L4.95781 6.70863L1.63281 10.0336" stroke="#060B13" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M8.75 4.08325H12.25V7.58325" stroke="#060B13" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <span>{(( (totalAmounts[0] / totalAmounts[1]) - 1 ) * 100).toFixed(2)}%</span>
            </div>
            {/if}
        </div>
    </div>
    <div class="overview-card">
        <div class="overview-header">
            <div class="overview-type">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M2 8C2 9.18669 2.35189 10.3467 3.01118 11.3334C3.67047 12.3201 4.60754 13.0892 5.7039 13.5433C6.80026 13.9974 8.00666 14.1162 9.17054 13.8847C10.3344 13.6532 11.4035 13.0818 12.2426 12.2426C13.0818 11.4035 13.6532 10.3344 13.8847 9.17054C14.1162 8.00666 13.9974 6.80026 13.5433 5.7039C13.0892 4.60754 12.3201 3.67047 11.3334 3.01118C10.3467 2.35189 9.18669 2 8 2C6.32263 2.00631 4.71265 2.66082 3.50667 3.82667L2 5.33333" stroke="white" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M2 2V5.33333H5.33333" stroke="white" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M8 4.66669V8.00002L10.6667 9.33335" stroke="white" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <p class="overview-name">Purchase Count</p>
            </div>
            <div class="tooltip-wrapper">
                <div class="tooltip-content">
                    Compared to last week
                </div>
                <div>
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
                        <path d="M8.99609 16.5005C13.1382 16.5005 16.4961 13.1426 16.4961 9.00049C16.4961 4.85835 13.1382 1.50049 8.99609 1.50049C4.85396 1.50049 1.49609 4.85835 1.49609 9.00049C1.49609 13.1426 4.85396 16.5005 8.99609 16.5005Z" stroke="white" stroke-opacity="0.24" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M9 12V9" stroke="white" stroke-opacity="0.24" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M9 6.00024H9.0075" stroke="white" stroke-opacity="0.24" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </div>
            </div>
        </div>
        <div class="overview-content">
            <div class="overview-number">
                {#if purchases.length > 1}
                {purchases[0]}
                {:else}
                {@html spinner}
                {/if}
            </div>
            <div class="overview-percentage down-metric">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M11.7828 9.44971L7.29115 4.95804L4.95781 7.29137L1.63281 3.96637" stroke="#060B13" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M8.75 9.91681H12.25V6.41681" stroke="#060B13" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>

                <span>{(( (purchases[0] / purchases[1]) - 1 ) * 100).toFixed(2)}%</span>
            </div>
        </div>
    </div>
    <!-- device used -->
    <div class="overview-card" id = "doughnut-charts">
        <div class="overview-header">
            <div class="overview-type">
                <!-- <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M10.6693 14V12.6667C10.6693 11.9594 10.3883 11.2811 9.88822 10.781C9.38812 10.281 8.70985 10 8.0026 10H4.0026C3.29536 10 2.61708 10.281 2.11699 10.781C1.61689 11.2811 1.33594 11.9594 1.33594 12.6667V14" stroke="white" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M6.0026 7.33333C7.47536 7.33333 8.66927 6.13943 8.66927 4.66667C8.66927 3.19391 7.47536 2 6.0026 2C4.52984 2 3.33594 3.19391 3.33594 4.66667C3.33594 6.13943 4.52984 7.33333 6.0026 7.33333Z" stroke="white" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M14.6641 13.9998V12.6664C14.6636 12.0756 14.467 11.5016 14.105 11.0346C13.743 10.5677 13.2361 10.2341 12.6641 10.0864" stroke="white" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M10.6641 2.08643C11.2377 2.23329 11.7461 2.56689 12.1092 3.03463C12.4722 3.50237 12.6693 4.07765 12.6693 4.66976C12.6693 5.26187 12.4722 5.83715 12.1092 6.30488C11.7461 6.77262 11.2377 7.10622 10.6641 7.25309" stroke="white" stroke-linecap="round" stroke-linejoin="round"/>
                </svg> -->
                <p class="overview-name">Device Type</p>
                <!-- <Dropdown
                    options={deviceTypeOption}
                    bind:selectedStatusIndex={selectedIndex}
                    position="center"
                /> -->
            </div>
            <div class="tooltip-wrapper">
                <div class="tooltip-content">
                    Compared device type
                </div>
                <div>
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
                        <path d="M8.99609 16.5005C13.1382 16.5005 16.4961 13.1426 16.4961 9.00049C16.4961 4.85835 13.1382 1.50049 8.99609 1.50049C4.85396 1.50049 1.49609 4.85835 1.49609 9.00049C1.49609 13.1426 4.85396 16.5005 8.99609 16.5005Z" stroke="white" stroke-opacity="0.24" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M9 12V9" stroke="white" stroke-opacity="0.24" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M9 6.00024H9.0075" stroke="white" stroke-opacity="0.24" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </div>
            </div>
        </div>

        <!-- <Chart
            headline=""
            showLegend = {true}
            dataOptions = {{
                displayOptions: {
                    "chartType": "pie",
                },
                event : "PageView",
                breakdownValue: [{value : "browserLocales.deviceType"}],
                measurementType : "unique",
                accuracyUnit: "month"
            }}
        /> -->
    </div>
</div>


<style>

    .overview-container {
        display: flex;
        align-items: flex-end;
        justify-content: flex-end;
        flex-direction: column;
        gap: 3rem;
        width: 100%;
        max-width: 31.2rem;
    }

    .overview-card {
        width: 100%;
        max-width: 31.2rem;
        display: flex;
        flex-direction: column;
        gap: 2.4rem;

        padding: 2.2rem 2.4rem;
        border-radius: 1.6rem;

        background-color: #060B13;
        border: .1rem solid rgba(255, 255, 255, 0.06);
        font-size: 1.4rem;
    }

    .overview-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    .overview-type {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        gap: .8rem;
    }
    .overview-content {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    .overview-number {
        font-size: 2.8rem;
        line-height: 3.2rem;
        font-weight: 400;
    }

    .overview-percentage {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: .4rem;

        padding: .2rem .6rem;
        border-radius: 3rem;
        color: #000;
    }

    .overview-percentage.up-metric {
        background-color: #0CB47F;
    }
    .overview-percentage.down-metric {
        background-color: #F37361;
    }

    .overview-card .tooltip-content{
        text-align: right;
        width: fit-content;
        min-width: fit-content;
        white-space: pre;
    }
    g{
        cursor: pointer;
    }
    #loader{
        display: flex;
        justify-content: center;
        align-items: center;
    }
</style>