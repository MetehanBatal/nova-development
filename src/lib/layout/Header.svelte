<script>
	import { user } from '$stores/user';

	export let notificationActive;
	export let notificationCount;
	
	let searchPopupRevealed = false;
</script>

<div class="user-navbar-wrapper">
	<div class="user-navbar">
		<div class="input-holder">
			<input class="input" placeholder="Search " type="text" on:focus={() => searchPopupRevealed = true}/>
			<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
				<path d="M7.33333 12.6667C10.2789 12.6667 12.6667 10.2789 12.6667 7.33333C12.6667 4.38781 10.2789 2 7.33333 2C4.38781 2 2 4.38781 2 7.33333C2 10.2789 4.38781 12.6667 7.33333 12.6667Z" stroke="#88888A" stroke-linecap="round" stroke-linejoin="round" />
				<path d="M13.9995 14.0001L11.1328 11.1335" stroke="#88888A" stroke-linecap="round" stroke-linejoin="round"/>
			</svg>
		</div>

		<div class="app-logo"></div>

		<div class="notification-handler"  class:active={notificationActive} on:click={() => notificationActive = !notificationActive}>
			<div class="notification-icon-holder">
				{#if notificationCount >= 1}
					<div class="notification-on"></div>
				{/if}
				<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
					<path d="M4.5 6C4.5 4.80653 4.97411 3.66193 5.81802 2.81802C6.66193 1.97411 7.80653 1.5 9 1.5C10.1935 1.5 11.3381 1.97411 12.182 2.81802C13.0259 3.66193 13.5 4.80653 13.5 6C13.5 11.25 15.75 12.75 15.75 12.75H2.25C2.25 12.75 4.5 11.25 4.5 6Z" stroke="#88888A" stroke-linecap="round" stroke-linejoin="round"/>
					<path d="M7.72656 15.75C7.8521 15.9783 8.03665 16.1688 8.26093 16.3014C8.48521 16.434 8.741 16.504 9.00156 16.504C9.26213 16.504 9.51791 16.434 9.74219 16.3014C9.96648 16.1688 10.151 15.9783 10.2766 15.75" stroke="#88888A" stroke-linecap="round" stroke-linejoin="round"/>
					<circle cx="14.5" cy="3.5" r="3" fill="transparent" stroke="transparent"/>
				</svg>
			</div>
		</div>
		<a href="/profile-settings" class="user-avatar">
			<div class="avatar-image">
				<img src={`${$user.thumbnail.length > 0 ? $user.thumbnail : '/assets/icons/logo-circle.png'}`} alt="">
			</div>
			
			<p>{`${$user.firstName} ${$user.lastName.slice(0,1)}.`}</p>
		</a>
	</div>
</div>

{#if searchPopupRevealed}
	<div class="search-popup-wrapper">
		<div class="search-popup">
			<div class="search-popup-input-wrapper">
				<div class="search-popup-input">
					<input class="input" placeholder="Search " type="text"/>
					<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
						<path d="M7.33333 12.6667C10.2789 12.6667 12.6667 10.2789 12.6667 7.33333C12.6667 4.38781 10.2789 2 7.33333 2C4.38781 2 2 4.38781 2 7.33333C2 10.2789 4.38781 12.6667 7.33333 12.6667Z" stroke="#88888A" stroke-linecap="round" stroke-linejoin="round" />
						<path d="M13.9995 14.0001L11.1328 11.1335" stroke="#88888A" stroke-linecap="round" stroke-linejoin="round"/>
					</svg>
				</div>
				<svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" on:click={() => searchPopupRevealed = false}>
					<path d="M10 2L2 10" stroke="#6E6D81" stroke-linecap="round" stroke-linejoin="round"></path>
					<path d="M2 2L10 10" stroke="#6E6D81" stroke-linecap="round" stroke-linejoin="round"></path>
				</svg>
			</div>
			<div class="search-popup-lists">
				<div class="search-popup-list">
					<div class="search-popup-title">
						Quick actions
					</div>
					<div class="search-popup-item">
						<a href="/experiments" on:click={() => searchPopupRevealed = false}>
							<img width="16px" src="/assets/icons/search-popup/create-experiment.svg" alt="Create Experiment">
							Create Experiment							
						</a>
					</div>
					<div class="search-popup-item">
						<details>
							<summary>
								<img width="16px" src="/assets/icons/search-popup/view-experiment-result.svg" alt="Create Experiment">
								View experiment result
								
								<svg width="8" height="6" viewBox="0 0 8 6" fill="none" xmlns="http://www.w3.org/2000/svg">
									<path d="M0.5 1.25L4 4.75L7.5 1.25" stroke="white" stroke-linecap="round" stroke-linejoin="round"/>
								</svg>									
							</summary>
							<div class="open-summary">
								<a href="/experiments" on:click={() => searchPopupRevealed = false}>
									<img width="16px" src="/assets/icons/search-popup/create-experiment.svg" alt="Create Experiment">
									Create Experiment							
								</a>
								<a href="/experiments" on:click={() => searchPopupRevealed = false}>
									<img width="16px" src="/assets/icons/search-popup/create-experiment.svg" alt="Create Experiment">
									Create Experiment							
								</a>
								<a href="/experiments" on:click={() => searchPopupRevealed = false}>
									<img width="16px" src="/assets/icons/search-popup/create-experiment.svg" alt="Create Experiment">
									Create Experiment							
								</a>
							</div>
						</details>
					</div>
					<div class="search-popup-item">
						<a href="/settings" on:click={() => searchPopupRevealed = false}>
							<img width="16px" src="/assets/icons/search-popup/team-settings.svg" alt="Create Experiment">
							Team Settings						
						</a>
					</div>
				</div>
				<div class="search-popup-list">
					<div class="search-popup-title">
						Navigation
					</div>
					<div class="search-popup-item">
						<a href="/experiments" on:click={() => searchPopupRevealed = false}>
							<img width="16px" src="/assets/icons/search-popup/experiments.svg" alt="Create Experiment">
							Experiments							
						</a>
					</div>
					<div class="search-popup-item">
						<a href="/purchases" on:click={() => searchPopupRevealed = false}>
							<img width="16px" src="/assets/icons/search-popup/purchases.svg" alt="Create Experiment">
							Purchases							
						</a>
					</div>
					<div class="search-popup-item">
						<a href="/content-modeling" on:click={() => searchPopupRevealed = false}>
							<img width="16px" src="/assets/icons/search-popup/content-modeling.svg" alt="Create Experiment">
							Content Modeling							
						</a>
					</div>
				</div>
				<div class="search-popup-list">
					<div class="search-popup-title">
						User Settings
					</div>
					<div class="search-popup-item">
						<a href="/settings" on:click={() => searchPopupRevealed = false}>
							<img width="16px" src="/assets/icons/search-popup/invite-member.svg" alt="Create Experiment">
							Invite Member						
						</a>
					</div>
					<div class="search-popup-item" on:click={() => searchPopupRevealed = false}>
						<a href="/purchases">
							<img width="16px" src="/assets/icons/search-popup/audit-log.svg" alt="Create Experiment">
							Audit Log							
						</a>
					</div>
				</div>
				<div class="search-popup-list">
					<div class="search-popup-title">
						Help
					</div>
					<div class="search-popup-item">
						<a href="/settings" on:click={() => searchPopupRevealed = false}>
							<img width="16px" src="/assets/icons/search-popup/invite-member.svg" alt="Create Experiment">
							Ask NovaAI						
						</a>
					</div>
					<div class="search-popup-item">
						<a href="mailto:info@novus.studio" on:click={() => searchPopupRevealed = false}>
							<img width="16px" src="/assets/icons/search-popup/audit-log.svg" alt="Create Experiment">
							Give Feedback or Suggest a New Command							
						</a>
					</div>
					<div class="search-popup-item">
						<a href="mailto:info@novus.studio" on:click={() => searchPopupRevealed = false}>
							<img width="16px" src="/assets/icons/search-popup/team-settings.svg" alt="Create Experiment">
							Contact the Support Team							
						</a>
					</div>
				</div>
			</div>
		</div>
	</div>
{/if}

<style>

	.user-navbar-wrapper {
		display: flex;
		align-items: center;
		justify-content: flex-end;

		position: fixed;
		top: 0;
		right: 0;

		width: calc(100% - 6.4rem);
		height: 6.4rem;

		background-color: #060B13;

		z-index: 3;

		border-bottom: .1rem solid #1A1F26;
	}
	

	.user-navbar {
		position: absolute;
		height: 6.4rem;
		top: 0;
		right: 0;
		z-index: auto;
		display: flex;
		align-items: center;
		justify-content: flex-end;
		gap: 3.2rem;
		padding-right: 2.4rem;
	}

	.dropdown-title {
		min-width: 18rem;
	}

	.user-navbar .input {
		min-width: 26.9rem;
		background-color: #212830;
	}

	.user-avatar img {
		max-width: 3.2rem;
	}

	.user-avatar {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: .8rem;

		padding: .4rem 1.1rem .4rem .8rem;

		border-radius: .8rem;
		border: .1rem solid #1A1F26;
		background: #0D121A;
	}

	.avatar-image {
		width: 4rem;
        height: 4rem;

		display: flex;
        align-items: center;
        justify-content: center;

        padding: .6rem;
        margin-right: .8rem;

		border-radius: 50%;
	}

	.app-logo {
		border-radius: 50%;
	}

	.notification-handler {
		display: flex;
		align-items: center;
		justify-content: center;

		padding: 1rem;

		border-radius: .8rem;

		cursor: pointer;

		transition: all .3s ease-in-out;
	}

	.notification-handler.active {
		background-color: rgba(33, 40, 48, 1);
	}

	.notification-handler.active svg path {
		stroke: #FFFFFF;
	}

	.notification-icon-holder {
		height: 1.8rem;
		width: 1.8rem;

		position: relative;
	}

	.notification-on {
		width: .6rem;
		height: .6rem;

		position: absolute;
		top: 0;
		right: .1rem;

		background-color: rgba(243, 115, 97, 1);

		border-radius: 50%;
	}

	.search-popup-wrapper {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;

		display: flex;
		align-items: center;
		justify-content: center;

		background-color: rgba(6, 11, 19, 0.8);

		z-index: 10;
	}

	.search-popup {
		width: 100%;
		max-width: 52.5rem;
		max-height: 64.4rem;
		overflow-y: scroll;

		background-color: rgba(13, 18, 26, 1);

		border-bottom-right-radius: 1.6rem;
    	border-bottom-left-radius: 1.6rem;
	}

	.search-popup-input-wrapper {
		display: flex;
		align-items: center;
		justify-content: space-between;

		gap: 1.6rem;

		padding: .8rem 1.6rem .8rem .8rem;

		border: .1rem solid rgba(33, 40, 48, 1);
		border-top-right-radius: 1.6rem;
		border-top-left-radius: 1.6rem;

	}
	.search-popup-input {
		position: relative;
		width: 100%;
	}

	.search-popup-input .input {
		width: 100%;

		background-color: rgba(33, 40, 48, 1);
	}

	.search-popup-input svg {
		position: absolute;
		top: 50%;
		left: 0%;

		transform: translate3d( 100%, -50%, 0);
	}

	.search-popup-input-wrapper > svg {
		cursor: pointer;
	}

	.search-popup-title {
		width: 100%;

		padding: 1.2rem 0 1.2rem 1.6rem;

		background-color: rgba(21, 24, 30, 1);
		color: rgba(136, 136, 138, 1);

		font-size: 1.4rem;
		line-height: 1.8rem;
	}

	.search-popup-lists {
		border: .1rem solid rgba(33, 40, 48, 1);
		border-top: 0;
	}

	.search-popup-item a {
		display: flex;
		align-items: center;
		justify-content: flex-start;
		gap: 1.2rem;

		padding: 1.3rem 0 1.3rem 1.6rem;

		font-size: 1.4rem;
		line-height: 1.8rem;
	}
	.search-popup-item details {
		display: flex;
		align-items: center;
		justify-content: flex-start;
		gap: 1.2rem;

		font-size: 1.4rem;
		line-height: 1.8rem;
	}

	.search-popup-item summary {
		width: 100%;
		display: flex;
		align-items: center;
		gap: 1.3rem;

		padding: 1.3rem 1.15rem 1.3rem 1.6rem;

		cursor: pointer;
	}

	details[open] summary > svg {
		transform: rotate(180deg);
	}
	.search-popup-item summary svg {
		margin-left: auto;
	}

	.search-popup-item img {
		width: 1.6rem;
	}

	.search-popup-list .search-popup-item:not(:last-child) {
		border-bottom: .1rem solid rgba(33, 40, 48, 1);
	}
</style>