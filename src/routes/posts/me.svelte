<script context="module" lang="ts">
	export const prerender = true;
</script>

<script lang="ts">
	import { goto } from '$app/navigation';
	import { session } from '$app/stores';
	import { getMyPosts } from '$lib/apis/postApi';
	import type { Post } from '$lib/domain/post';
	import type { AppStoreType } from '$lib/stores/AppStore';
	import { get } from 'svelte/store';
	import { onMount } from 'svelte';

	let posts: Post[] = [];

	const token = get<AppStoreType>(session).accessToken;

	onMount(async () => {
		const res = await getMyPosts(token, 1);
		console.log(res);
	});
	const goPage = async () => {
		goto('/posts');
	};
</script>

<svelte:head>
	<title>Home</title>
</svelte:head>

<section>
	<h1>
		<button on:click={goPage}>click {token}</button>
	</h1>

	<h2>
		try editing <strong>src/routes/index.svelte</strong>
	</h2>
</section>

<style>
	section {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		flex: 1;
	}

	h1 {
		width: 100%;
	}

	.welcome {
		position: relative;
		width: 100%;
		height: 0;
		padding: 0 0 calc(100% * 495 / 2048) 0;
	}

	.welcome img {
		position: absolute;
		width: 100%;
		height: 100%;
		top: 0;
		display: block;
	}
</style>
