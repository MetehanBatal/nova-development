<script>
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { user } from '../../stores/user';
	import Cookies from 'js-cookie';
	import MenuItem from '$lib/layout/MenuItem.svelte';
	
	let menuItems = [
		{
			name: 'Dashboard',
			slug: '/dashboard',
			icon: 
				`<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 22 22" fill="none">
					<path d="M19.4455 14.5659C18.8623 15.945 17.9502 17.1603 16.7889 18.1054C15.6275 19.0506 14.2523 19.6969 12.7835 19.9878C11.3147 20.2787 9.79703 20.2054 8.36311 19.7742C6.92919 19.3431 5.62271 18.5672 4.55791 17.5145C3.4931 16.4618 2.70239 15.1643 2.25489 13.7354C1.80739 12.3065 1.71674 10.7897 1.99086 9.31765C2.26497 7.84562 2.89551 6.46315 3.82735 5.2911C4.75919 4.11905 5.96395 3.19311 7.33631 2.59424" stroke="#88888A" stroke-linecap="round" stroke-linejoin="round"/>
					<path d="M20.1667 11C20.1667 9.79626 19.9296 8.60426 19.4689 7.49211C19.0082 6.37996 18.333 5.36943 17.4818 4.51823C16.6306 3.66702 15.6201 2.99181 14.5079 2.53115C13.3958 2.07048 12.2038 1.83337 11 1.83337V11H20.1667Z" stroke="#88888A" stroke-linecap="round" stroke-linejoin="round"/>
				</svg>`
		},
		{
			name: 'Content Modeling',
			slug: '/content-modeling',
			icon: 
				`<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 22 22" fill="none">
					<path d="M18.1958 3.08814C18.303 2.98093 18.4303 2.8959 18.5704 2.83788C18.7104 2.77986 18.8605 2.75 19.0122 2.75C19.1638 2.75 19.3139 2.77986 19.454 2.83788C19.594 2.8959 19.7213 2.98093 19.8285 3.08814C19.9357 3.19534 20.0207 3.32261 20.0787 3.46267C20.1368 3.60274 20.1666 3.75286 20.1666 3.90447C20.1666 4.05608 20.1368 4.2062 20.0787 4.34627C20.0207 4.48633 19.9357 4.6136 19.8285 4.7208L16.838 7.70028L14.6666 8.25L15.2108 6.07861L18.1958 3.08814Z" stroke="#88888A" stroke-linecap="round" stroke-linejoin="round"/>
					<path d="M20.1667 9.625V13.75C20.1667 14.2362 19.9736 14.7025 19.6297 15.0464C19.2859 15.3902 18.8196 15.5833 18.3334 15.5833H3.66671C3.18048 15.5833 2.71416 15.3902 2.37034 15.0464C2.02653 14.7025 1.83337 14.2362 1.83337 13.75V4.58333C1.83337 4.0971 2.02653 3.63079 2.37034 3.28697C2.71416 2.94315 3.18048 2.75 3.66671 2.75H13.2917" stroke="#88888A" stroke-linecap="round" stroke-linejoin="round"/>
					<path d="M11 15.5833V19.25" stroke="#88888A" stroke-linecap="round" stroke-linejoin="round"/>
					<path d="M7.33337 19.25H14.6667" stroke="#88888A" stroke-linecap="round" stroke-linejoin="round"/>
				</svg>`
		},
		{
			name: 'Experiments',
			slug: '/experiments',
			icon: 
				`<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 22 22" fill="none">
					<path d="M9.16658 1.83331V8.73306C9.16685 9.01816 9.10062 9.29938 8.97317 9.5544L4.32658 18.8375C4.25591 18.9777 4.22245 19.1338 4.22942 19.2906C4.23638 19.4475 4.28353 19.6 4.36635 19.7334C4.44916 19.8668 4.56487 19.9768 4.70237 20.0526C4.83987 20.1285 4.99455 20.1677 5.15158 20.1666H16.8483C17.0053 20.1677 17.16 20.1285 17.2975 20.0526C17.435 19.9768 17.5507 19.8668 17.6335 19.7334C17.7163 19.6 17.7635 19.4475 17.7704 19.2906C17.7774 19.1338 17.7439 18.9777 17.6733 18.8375L13.0267 9.5544C12.8992 9.29938 12.833 9.01816 12.8333 8.73306V1.83331" stroke="#88888A" stroke-linecap="round" stroke-linejoin="round"/>
					<path d="M7.7915 1.83331H14.2082" stroke="#88888A" stroke-linecap="round" stroke-linejoin="round"/>
					<path d="M6.4165 14.6667H15.5832" stroke="#88888A" stroke-linecap="round" stroke-linejoin="round"/>
				</svg>`
		},
		{
			name: 'Purchases',
			slug: '/purchases',
			icon: 
				`<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 22 22" fill="none">
					<path d="M5.5 1.83331L2.75 5.49998V18.3333C2.75 18.8195 2.94315 19.2859 3.28697 19.6297C3.63079 19.9735 4.0971 20.1666 4.58333 20.1666H17.4167C17.9029 20.1666 18.3692 19.9735 18.713 19.6297C19.0568 19.2859 19.25 18.8195 19.25 18.3333V5.49998L16.5 1.83331H5.5Z" stroke="#88888A" stroke-linecap="round" stroke-linejoin="round"/>
					<path d="M2.75 5.5H19.25" stroke="#88888A" stroke-linecap="round" stroke-linejoin="round"/>
					<path d="M14.6693 9.1665C14.6693 10.139 14.283 11.0716 13.5953 11.7592C12.9077 12.4469 11.9751 12.8332 11.0026 12.8332C10.0301 12.8332 9.09751 12.4469 8.40988 11.7592C7.72225 11.0716 7.33594 10.139 7.33594 9.1665" stroke="#88888A" stroke-linecap="round" stroke-linejoin="round"/>
				</svg>`
		},
		{
			name: 'Products',
			slug: '/products',
			icon:
				`<svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
					<path d="M17.4167 2.75H4.58333C3.57081 2.75 2.75 3.57081 2.75 4.58333V17.4167C2.75 18.4292 3.57081 19.25 4.58333 19.25H17.4167C18.4292 19.25 19.25 18.4292 19.25 17.4167V4.58333C19.25 3.57081 18.4292 2.75 17.4167 2.75Z" stroke="#88888A" stroke-width="1.375" stroke-linecap="round" stroke-linejoin="round"/>
					<path d="M8.25 7.3335H14.6667" stroke="#88888A" stroke-width="1.375" stroke-linecap="round" stroke-linejoin="round"/>
					<path d="M7.33301 11H12.833" stroke="#88888A" stroke-width="1.375" stroke-linecap="round" stroke-linejoin="round"/>
					<path d="M10.083 14.6665H14.6663" stroke="#88888A" stroke-width="1.375" stroke-linecap="round" stroke-linejoin="round"/>
				</svg>
				`
		},
		{
			name: 'Settings',
			slug: '/settings',
			icon: 
				`<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 22 22" fill="none">
					<path d="M11.2022 1.83301H10.7988C10.3126 1.83301 9.84628 2.02616 9.50246 2.36998C9.15864 2.7138 8.96549 3.18011 8.96549 3.66634V3.83134C8.96516 4.15284 8.88029 4.4686 8.7194 4.74694C8.55851 5.02529 8.32725 5.25643 8.04882 5.41717L7.65466 5.64634C7.37596 5.80725 7.05981 5.89196 6.73799 5.89196C6.41617 5.89196 6.10003 5.80725 5.82132 5.64634L5.68382 5.57301C5.26313 5.33033 4.76334 5.2645 4.29416 5.38996C3.82498 5.51542 3.42475 5.82192 3.18132 6.24217L2.97966 6.59051C2.73698 7.0112 2.67115 7.51099 2.79661 7.98017C2.92206 8.44936 3.22856 8.84959 3.64882 9.09301L3.78632 9.18468C4.06341 9.34464 4.29381 9.57434 4.45462 9.85094C4.61543 10.1275 4.70106 10.4414 4.70299 10.7613V11.2288C4.70427 11.5519 4.62017 11.8695 4.4592 12.1496C4.29822 12.4297 4.0661 12.6623 3.78632 12.8238L3.64882 12.9063C3.22856 13.1498 2.92206 13.55 2.79661 14.0192C2.67115 14.4884 2.73698 14.9882 2.97966 15.4088L3.18132 15.7572C3.42475 16.1774 3.82498 16.4839 4.29416 16.6094C4.76334 16.7349 5.26313 16.669 5.68382 16.4263L5.82132 16.353C6.10003 16.1921 6.41617 16.1074 6.73799 16.1074C7.05981 16.1074 7.37596 16.1921 7.65466 16.353L8.04882 16.5822C8.32725 16.7429 8.55851 16.9741 8.7194 17.2524C8.88029 17.5308 8.96516 17.8465 8.96549 18.168V18.333C8.96549 18.8192 9.15864 19.2856 9.50246 19.6294C9.84628 19.9732 10.3126 20.1663 10.7988 20.1663H11.2022C11.6884 20.1663 12.1547 19.9732 12.4985 19.6294C12.8423 19.2856 13.0355 18.8192 13.0355 18.333V18.168C13.0358 17.8465 13.1207 17.5308 13.2816 17.2524C13.4425 16.9741 13.6737 16.7429 13.9522 16.5822L14.3463 16.353C14.625 16.1921 14.9412 16.1074 15.263 16.1074C15.5848 16.1074 15.901 16.1921 16.1797 16.353L16.3172 16.4263C16.7378 16.669 17.2376 16.7349 17.7068 16.6094C18.176 16.4839 18.5762 16.1774 18.8197 15.7572L19.0213 15.3997C19.264 14.979 19.3298 14.4792 19.2044 14.01C19.0789 13.5408 18.7724 13.1406 18.3522 12.8972L18.2147 12.8238C17.9349 12.6623 17.7028 12.4297 17.5418 12.1496C17.3808 11.8695 17.2967 11.5519 17.298 11.2288V10.7705C17.2967 10.4475 17.3808 10.1298 17.5418 9.84971C17.7028 9.56962 17.9349 9.33703 18.2147 9.17551L18.3522 9.09301C18.7724 8.84959 19.0789 8.44936 19.2044 7.98017C19.3298 7.51099 19.264 7.0112 19.0213 6.59051L18.8197 6.24217C18.5762 5.82192 18.176 5.51542 17.7068 5.38996C17.2376 5.2645 16.7378 5.33033 16.3172 5.57301L16.1797 5.64634C15.901 5.80725 15.5848 5.89196 15.263 5.89196C14.9412 5.89196 14.625 5.80725 14.3463 5.64634L13.9522 5.41717C13.6737 5.25643 13.4425 5.02529 13.2816 4.74694C13.1207 4.4686 13.0358 4.15284 13.0355 3.83134V3.66634C13.0355 3.18011 12.8423 2.7138 12.4985 2.36998C12.1547 2.02616 11.6884 1.83301 11.2022 1.83301Z" stroke="#88888A" stroke-linecap="round" stroke-linejoin="round"/>
					<path d="M11 13.75C12.5188 13.75 13.75 12.5188 13.75 11C13.75 9.48122 12.5188 8.25 11 8.25C9.48122 8.25 8.25 9.48122 8.25 11C8.25 12.5188 9.48122 13.75 11 13.75Z" stroke="#88888A" stroke-linecap="round" stroke-linejoin="round"/>
				</svg>`
		}
	];

	setTimeout(() => {
		if($user.role !== 'Admin') {
			menuItems.pop();
		}
	}, 120)

	function handleSignOut() {
		Cookies.remove('novaUser');
		goto('/login');
	};
</script>


<nav class="sidebar">
	<div class="logo">
		<img src="/assets/icons/logo.svg" width="50" height="50">
	</div>

	<div class="menu">
		{#each menuItems as menuItem, _index}
		<MenuItem itemData={menuItem} />
		{/each}
	</div>

	<div class="exit-field">
		<a href='/help-center' class="menu-item" class:active={$page.url.pathname?.includes('/help-center')}>
			<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 22 22" fill="none">
				<path d="M11.0026 20.1668C16.0652 20.1668 20.1693 16.0628 20.1693 11.0002C20.1693 5.93755 16.0652 1.8335 11.0026 1.8335C5.93999 1.8335 1.83594 5.93755 1.83594 11.0002C1.83594 16.0628 5.93999 20.1668 11.0026 20.1668Z" stroke="#88888A" stroke-linecap="round" stroke-linejoin="round"/>
				<path d="M8.33203 8.25003C8.54754 7.6374 8.97292 7.1208 9.53282 6.79174C10.0927 6.46268 10.751 6.34239 11.3911 6.45219C12.0312 6.56198 12.6118 6.89476 13.03 7.3916C13.4483 7.88844 13.6772 8.51726 13.6762 9.1667C13.6762 11 10.9262 11.9167 10.9262 11.9167" stroke="#88888A" stroke-linecap="round" stroke-linejoin="round"/>
				<path d="M11 15.5833H11.0103" stroke="#88888A" stroke-linecap="round" stroke-linejoin="round"/>
			</svg>
			<div class="name">Help Center</div>
		</a>
		<div class="menu-item" on:click={() => handleSignOut()}>
			<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 22 22" fill="none">
				<path d="M8.25 19.25H4.58333C4.0971 19.25 3.63079 19.0568 3.28697 18.713C2.94315 18.3692 2.75 17.9029 2.75 17.4167V4.58333C2.75 4.0971 2.94315 3.63079 3.28697 3.28697C3.63079 2.94315 4.0971 2.75 4.58333 2.75H8.25" stroke="#88888A" stroke-linecap="round" stroke-linejoin="round"/>
				<path d="M14.6641 15.5832L19.2474 10.9998L14.6641 6.4165" stroke="#88888A" stroke-linecap="round" stroke-linejoin="round"/>
				<path d="M19.25 11H8.25" stroke="#88888A" stroke-linecap="round" stroke-linejoin="round"/>
			</svg>
			<div class="name">Sign Out</div>
		</div>
	</div>
</nav>




<style>
	svg, path {
		transition: all .3s ease-in-out;
	}

	.sidebar {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;

		position: sticky;
		left: 0;
		top: 0;

		width: 9.4rem;
		height: 100dvh;
		
		padding: 1.8rem 1.7rem 2.4rem 1.7rem;
		z-index: 6;
		
		background-color: #060B13;
		border-right: .1rem solid #1A1F26;

        transition: all .24s ease-in-out;
	}

    :global(.sidebar.shrunk) {
		width: 0!important;

		padding-left: 0!important;
		padding-right: 0!important;

		overflow: hidden!important;
	}

	.menu {
		display: flex;
		flex-direction: column;
		gap: 1.6rem;

		margin-block: auto;
	}

	.menu-item {
		position: relative;
		
		padding: 1.2rem;
		border-radius: .8rem;
		background-color: transparent;
		transition: all .3s ease-in-out;
		
		cursor: pointer;
		
		z-index: 5;
	}

	.menu-item.active {
		background-color: #1A1F26;
	}

	.menu-item:hover {
		background-color: #1A1F26;
	}

	:global(.menu-item.active svg),
	:global(.menu-item.active path) {
		stroke: #FFF;
	}

	:global(.menu-item:hover svg),
	:global(.menu-item:hover path) {
		stroke: #FFF;
	}

	.exit-field {
		display: flex;
		flex-direction: column;
		gap: .8rem;
	}

	.menu-item .name {
		position: absolute;
		right: 0;
		top: 15%;

		visibility: hidden;
		opacity: 0;
		
		padding: .8rem 1.2rem;
		
		border-radius: .8rem;
		background-color: #1A1F26;
		
		transform: translateX(110%);
		white-space: pre;
		font-size: 1.4rem;
		
		transition: all .3s ease-in-out;
		
		z-index: 5;
	}

	.menu-item .name::after {
		position: absolute;
		left: -.5rem;
		top: 30%;

		content: "";
		
		width: 0;
		height: 0;

		border-top: .5rem solid transparent;
		border-right: .5rem solid #1A1F26;
		border-bottom: .5rem solid transparent;

		z-index: 100000;
	}

	.menu-item:hover .name {
		visibility: visible;
		opacity: 1;
	}

	@media screen and (max-width: 768px) {

		.sidebar {
			display: none;
		}
		
	}

</style>