<script>
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';

	// IF; logged in redirect to dashboard,
	// IF NOT; redirect to login
	//
	if (browser) {
		goto('/dashboard'); }
</script>