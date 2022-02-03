<script lang="ts">
	import { goto } from '$app/navigation';

	import { session } from '$app/stores';
	import ErrorView from '$lib/components/blocks/ErrorView.svelte';
	import Header from '$lib/components/blocks/header/Header.svelte';
	import { ErrorInfo } from '$lib/domain/error';
	import CookieService from '$lib/services/CookieService';
	import { AppStoreType, AppStoreWrapper } from '$lib/stores/AppStore';
	import { onMount } from 'svelte';
	import type { Writable } from 'svelte/store';
	import '../app.css';

	let errorInfo: ErrorInfo = null;
	const appStore: Writable<AppStoreType> = session;
	let logined = false;
	appStore.subscribe((value) => {
		logined = value.accessToken !== '';
	});

	const handleException = (e: PromiseRejectionEvent) => {
		const newErrorInfo = ErrorInfo.fromError(e.reason, location.pathname);
		if (newErrorInfo.status === 401) {
			new AppStoreWrapper(appStore, new CookieService()).clear();
			goto(`/auth/login?redirectUrl=${newErrorInfo.from}`);
			return;
		}
		errorInfo = newErrorInfo;
	};

	onMount(() => {
		window.onunhandledrejection = handleException;
		window.removeEventListener('unhandledrejection', handleException);
	});

	// TODO ページ変わってもエラー画面のまま
</script>

<Header {logined} />

<main class="container">
	<div class="content">
		{#if !errorInfo}
			<slot />
		{:else}
			<ErrorView {errorInfo} />
		{/if}
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
