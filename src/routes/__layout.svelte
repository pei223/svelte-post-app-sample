<script lang="ts">
	import { session } from '$app/stores';
	import Header from '$lib/components/blocks/header/Header.svelte';
	import type { AppStoreType } from '$lib/stores/AppStore';
	import type { Writable } from 'svelte/store';
	import '../app.css';

	const appStore: Writable<AppStoreType> = session;
	let logined = false;
	appStore.subscribe((value) => {
		logined = value.accessToken !== '';
	});
</script>

<Header {logined} />

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
