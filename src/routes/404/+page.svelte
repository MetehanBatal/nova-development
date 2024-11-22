<div class="not-found-wrapper">
    <div class="login-box">
        <div class="logo-holder">
            <svg xmlns="http://www.w3.org/2000/svg" width="34" height="35" viewBox="0 0 34 35" fill="none"><path d="M8.42857 14.1429H5.57143C4.81367 14.1429 4.08694 13.8418 3.55112 13.306C3.0153 12.7702 2.71428 12.0435 2.71428 11.2857V5.57142C2.71428 4.81366 3.0153 4.08694 3.55112 3.55112C4.08694 3.0153 4.81367 2.71428 5.57143 2.71428H28.4286C29.1863 2.71428 29.9131 3.0153 30.4489 3.55112C30.9847 4.08694 31.2857 4.81366 31.2857 5.57142V11.2857C31.2857 12.0435 30.9847 12.7702 30.4489 13.306C29.9131 13.8418 29.1863 14.1429 28.4286 14.1429H25.5714" stroke="#EBEBEC" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M8.42857 19.8571H5.57143C4.81367 19.8571 4.08694 20.1582 3.55112 20.694C3.0153 21.2298 2.71428 21.9565 2.71428 22.7143V28.4286C2.71428 29.1863 3.0153 29.9131 3.55112 30.4489C4.08694 30.9847 4.81367 31.2857 5.57143 31.2857H28.4286C29.1863 31.2857 29.9131 30.9847 30.4489 30.4489C30.9847 29.9131 31.2857 29.1863 31.2857 28.4286V22.7143C31.2857 21.9565 30.9847 21.2298 30.4489 20.694C29.9131 20.1582 29.1863 19.8571 28.4286 19.8571H25.5714" stroke="#EBEBEC" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M8.42857 8.42856H8.44181" stroke="#EBEBEC" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M8.42857 25.5714H8.44181" stroke="#EBEBEC" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M18.4286 8.42856L12.7143 17H21.2857L15.5714 25.5714" stroke="#EBEBEC" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </div>
        <p class="not-found-title">Page not found</p>
        <p class="not-found-subtitle">The page you are looking for <br> is not available...</p>
        <a href="/dashboard" class="cta-button primary">Back to home</a>
    </div>
</div>

<style scoped>
    .not-found-wrapper {
		position: relative;
		width: 100vw;
		height: 100vh;

		display: flex;
		align-items: center;
		justify-content: center;
        background-color: #060B13;
        z-index: 100;
        overflow: hidden;
	}

    .login-box {
		width: 100%;
		max-width: 40rem;

		border-radius: 1.6rem;
		border: .1rem solid rgba(255, 255, 255, 0.08);

		background: rgba(255, 255, 255, 0.02);

		padding: 4rem;

		display: flex;
        align-items: center;
		flex-direction: column;
	}

    .not-found-title {
		margin-block: 2.7rem;
		font-size: 2.2rem;
	}

    .not-found-subtitle {
        text-align: center;
        font-size: 1.8rem;
        line-height: 2.4rem;
        color: #88888A;
        margin-bottom: 3.2rem;
    }

    .logo-holder {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 2.2rem;
        border-radius: 50%;
        background-color: rgba(255, 255, 255, 0.04);
    }

</style>