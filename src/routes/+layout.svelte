<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import '../app.css';

	let { children } = $props();
</script>

<header class="flex items-center gap-2 px-20 pt-5 *:grow">
	<Button size="sm" href="/">Categories</Button>
	<Button size="sm" href="/products">Products</Button>
	<Button size="sm">Products in store</Button>
	<Button size="sm">Checks</Button>
	<Button size="sm">Employees</Button>
	<Button size="sm">Customers</Button>
</header>

{@render children()}
