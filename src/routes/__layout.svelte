<script lang="ts">
	import Header from '$lib/components/blocks/header/Header.svelte';
	import '../app.css';
</script>

<Header />

<main class="container">
	<div class="content">
		<slot />
	</div>
</main>

<footer>
	<p>visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to learn SvelteKit</p>
</footer>

<style>
	.container {
		padding: 2rem;
		display: flex;
		justify-content: center;
	}
	.content {
		width: 100%;
		max-width: 1280px;
	}
</style>
