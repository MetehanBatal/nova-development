<script>
    import KeenSlider from 'keen-slider';
    import { onMount } from 'svelte';
    
    let activeSlideIndex = 0;
    let mediaSlider = '';
    
    function initSlider() {
        var hubSlider = new KeenSlider(".hub-slider", { 
            loop: true,
            slides: {
              perView: 1,
              spacing: 24,
            },
            slideChanged(s) {
    
                activeSlideIndex = mediaSlider.track.details.rel;
                const firstThumbnail = document.querySelector(".thumbnail");
                if (firstThumbnail) {
                    firstThumbnail.classList.remove("active");
                }
    
            },
            
        });
        mediaSlider = hubSlider;	
    }
    
    onMount(() => {
        initSlider();
    })
    
    
    function handleThumbnailClick(el, goto) {
    
        document.querySelectorAll(".thumbnail").forEach((thumbnail) => thumbnail.classList.remove("active"));
        el.target.classList.add("active");
        mediaSlider.moveToIdx(goto);
    
        setTimeout(() => {
            mediaSlider.update();
        }, 300);
    }
    
</script>

<svelte:head>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/keen-slider@6.8.5/keen-slider.min.css" />
</svelte:head>

<div class="slider-container">
    <div class="left-bg">
        <svg xmlns="http://www.w3.org/2000/svg" width="121" height="172" viewBox="0 0 121 172" fill="none">
            <g filter="url(#filter0_f_1605_6094)">
                <ellipse cx="-21" cy="47.5" rx="88" ry="70.5" fill="white" fill-opacity="0.32" />
            </g>
            <defs>
                <filter id="filter0_f_1605_6094" x="-163" y="-77" width="284" height="249" filterUnits="userSpaceOnUse"
                    color-interpolation-filters="sRGB">
                    <feFlood flood-opacity="0" result="BackgroundImageFix" />
                    <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                    <feGaussianBlur stdDeviation="27" result="effect1_foregroundBlur_1605_6094" />
                </filter>
            </defs>
        </svg>
    </div>
    <div class="top-bg">
        <svg xmlns="http://www.w3.org/2000/svg" width="297" height="101" viewBox="0 0 297 101" fill="none">
            <g filter="url(#filter0_f_1605_6095)">
                <ellipse cx="121.5" rx="121.5" ry="47" fill="white" fill-opacity="0.4" />
            </g>
            <defs>
                <filter id="filter0_f_1605_6095" x="-54" y="-101" width="351" height="202" filterUnits="userSpaceOnUse"
                    color-interpolation-filters="sRGB">
                    <feFlood flood-opacity="0" result="BackgroundImageFix" />
                    <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                    <feGaussianBlur stdDeviation="27" result="effect1_foregroundBlur_1605_6095" />
                </filter>
            </defs>
        </svg>
    </div>
    <div class="slide-wrapper">
        <div class="slide-header">
            <div class="icon-holder">
                <div class="icon bg-white">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M8.66927 2H2.66927C2.31565 2 1.97651 2.14048 1.72646 2.39052C1.47641 2.64057 1.33594 2.97971 1.33594 3.33333V10C1.33594 10.3536 1.47641 10.6928 1.72646 10.9428C1.97651 11.1929 2.31565 11.3333 2.66927 11.3333H13.3359C13.6896 11.3333 14.0287 11.1929 14.2787 10.9428C14.5288 10.6928 14.6693 10.3536 14.6693 10V8" stroke="#947AF0" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M5.33594 14H10.6693" stroke="#947AF0" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M8 11.3333V14" stroke="#947AF0" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M11.3359 5.33333L14.6693 2" stroke="#947AF0" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M11.3359 2H14.6693V5.33333" stroke="#947AF0" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </div>
                <div class="slide-name">
                    Insight
                </div>
            </div>
            <div class="icon border-light">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M8.0026 8.66683C8.37079 8.66683 8.66927 8.36835 8.66927 8.00016C8.66927 7.63197 8.37079 7.3335 8.0026 7.3335C7.63441 7.3335 7.33594 7.63197 7.33594 8.00016C7.33594 8.36835 7.63441 8.66683 8.0026 8.66683Z" stroke="white" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M8.0026 3.99984C8.37079 3.99984 8.66927 3.70136 8.66927 3.33317C8.66927 2.96498 8.37079 2.6665 8.0026 2.6665C7.63441 2.6665 7.33594 2.96498 7.33594 3.33317C7.33594 3.70136 7.63441 3.99984 8.0026 3.99984Z" stroke="white" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M8.0026 13.3333C8.37079 13.3333 8.66927 13.0349 8.66927 12.6667C8.66927 12.2985 8.37079 12 8.0026 12C7.63441 12 7.33594 12.2985 7.33594 12.6667C7.33594 13.0349 7.63441 13.3333 8.0026 13.3333Z" stroke="white" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </div>
        </div>
        <div class="hub-slider">
            <div class="slider-item keen-slider__slide">
                <div class="slider-content">
                    <div class="content-header">
                        <h2>76.5%</h2>
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
                            <path d="M15.1516 5.85059L9.37656 11.6256L6.37656 8.62559L2.10156 12.9006" stroke="white" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M11.25 5.24969H15.75V9.74969" stroke="white" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </div>
                    <p>
                        <span> of your users are coming from the US</span><br> <br>
                        Consider tailoring your landing page content and offers to resonate more with American audiences to capitalize on the significant traffic from the USA. Highlight popular products, holidays, or cultural events relevant to the US market.
                    </p>
                </div>
            </div>
            <div class="slider-item keen-slider__slide">
                <div class="slider-content">
                    <div class="content-header">
                        <h2>14.1%</h2>
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
                            <path d="M15.1516 5.85059L9.37656 11.6256L6.37656 8.62559L2.10156 12.9006" stroke="white" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M11.25 5.24969H15.75V9.74969" stroke="white" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </div>
                    <p>
                        <span > increase on conversion rates over the past week, rising from 10.57% to 12.06%.</span><br> <br>
                        Analyze the successful campaigns or promotions that contributed to this increase and consider replicating similar strategies. Identify key elements such as messaging, timing, and channels used, and apply these insights to future campaigns to sustain the growth.
                    </p>
                </div>
            </div>

            <div class="slider-item keen-slider__slide">
                <div class="slider-content">
                    <div class="content-header">
                        <h2>1.8%</h2>
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
                            <path d="M15.1516 5.85059L9.37656 11.6256L6.37656 8.62559L2.10156 12.9006" stroke="white" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M11.25 5.24969H15.75V9.74969" stroke="white" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </div>
                    <p>
                        <span > Variant 2 win over the closest competitor.</span><br> <br>
                        Allocate more traffic to Variant 2 and consider using similar design elements and messaging in future experiments. The higher average revenue per user ($192.13 compared to $191.81) suggests that this variant not only converts better but also attracts higher-value customers.
                    </p>
                </div>
            </div>

            <div class="slider-item keen-slider__slide">
                <div class="slider-content">
                    <div class="content-header">
                        <h2>66.1%</h2>
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
                            <path d="M15.1516 5.85059L9.37656 11.6256L6.37656 8.62559L2.10156 12.9006" stroke="white" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M11.25 5.24969H15.75V9.74969" stroke="white" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </div>
                    <p>
                        <span > of users added items to their cart but did not complete the purchase.</span><br> <br>
                        Implement a retargeting campaign or send follow-up emails to recover abandoned carts. Highlight the benefits of completing the purchase, such as free shipping, easy returns, or customer reviews. Use urgency or scarcity tactics like limited-time offers to motivate users to finalize their purchases.
                    </p>
                </div>
            </div>
        </div>
        <div class="slider-paginations">
            <div class="slider-bullets">
                {#each Array(4) as image, index}
                    <div class="thumbnail pagination-indicator {activeSlideIndex === index ? 'active' : ''}" on:click={(e) => { handleThumbnailClick(e, index); }}></div>
                {/each}
            </div>
        </div>
    </div>
</div>

<style>

    .slider-container {
        position: relative;
        overflow: hidden;
        border-radius: 1.6rem;
    }   

    .slide-wrapper{
        position: relative;
        overflow: hidden;
        display: flex;
        align-items: center;
        max-width: 30rem;
        border-radius: 1.6rem;
        background-color: #7050A2;
    }

    .hub-slider {
        display: flex;
        align-items: flex-start;
        justify-content: flex-start;

        width: 100%;
    }

    .keen-slider__slide {
        min-width: 100% !important;
        max-width: 100% !important;
    }

    .slide-wrapper {
        flex-direction: column;

        padding: 3.2rem 2.4rem 2.4rem 2.4rem;
    }

    .top-bg {
        position: absolute;
        z-index: 1;
        top: 0;
        left: 0;
    }
    .left-bg {
        position: absolute;
        z-index: 1;
        top: 0;
        left: 0;
        transform: translateX(-3rem);
    }

    .icon-holder {
        display: flex;
        align-items: center;
        gap: 1.2rem;
    }

    .icon {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: .8rem;
        width: fit-content;
        border-radius: .8rem;
    }

    .slide-name {
        font-size: 1.8rem;
        line-height: 2.2rem;
        font-weight: 500;
    }

    .slider-item {
        max-width: 31.2rem;
        border-radius: 1.6rem;
        backdrop-filter: blur(.2rem);
    }

    .slide-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 4rem;

        width: 100%;
    }

    .content-header {
        display: flex;
        align-items: flex-start;
        justify-content: flex-start;
        gap: .6rem;
    }

    .content-header h2 {
        font-size: 6.4rem;
        line-height: 6rem;
    }

    .slider-content p  {
        margin-block: 2rem 6.2rem;
        font-size: 1.4rem;
        line-height: 1.8rem;
    }
    .slider-content p span {
        color:  rgba(255, 255, 255, 0.50);
    }

    .slider-bullets {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: .8rem;
    }

    .thumbnail {
        width: 3.2rem;
        height: .2rem;

        background-color: rgba(255, 255, 255, 0.16);

        border-radius: .6rem;
    }

    .thumbnail.active {
        background-color: rgba(255, 255, 255, 1);
    }

</style>