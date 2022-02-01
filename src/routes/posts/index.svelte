<script context="module" lang="ts">
	import type { Load } from '@sveltejs/kit';
	export const prerender = true;
	export const load: Load = async ({ params, url, stuff, session }) => {
		const page = 1;
		console.log(url.search);
		console.log(params);
		console.log(stuff);
		console.log(session);

		const res = await getPosts('', page);
		return {
			props: {
				posts: res.posts,
				page
			}
		};
	};
</script>

<script lang="ts">
	import { getStores } from '$app/stores';
	import { get } from 'svelte/store';

	const token = get(getStores().session).accessToken;
	console.log(token);
	import { getPosts } from '$lib/apis/postApi';
	import type { Post } from '$lib/domain/post';
	import PostCard from '$lib/components/blocks/PostCard.svelte';
	import Heading from '$lib/components/atoms/Heading.svelte';

	export let posts: Post[] = [];
	let page: number = 1;

	const onFavoriteChanged = (i: number, post: Post) => {
		console.log('Favorited');
	};
</script>

<svelte:head>
	<title>記事一覧</title>
</svelte:head>

<section>
	<Heading title="記事一覧" />
	{#each posts as post, i (post.id)}
		<div class="card-container">
			<PostCard {i} {post} {onFavoriteChanged} />
		</div>
	{:else}
		<div>データはありません</div>
	{/each}
</section>

<style>
	.card-container {
		margin-bottom: 20px;
	}
</style>
