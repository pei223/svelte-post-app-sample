<script context="module" lang="ts">
	import type { Load } from '@sveltejs/kit';
	export const load: Load = async ({ params, url, stuff, session }) => {
		const queries = new URLSearchParams(url.search);
		const page =
			queries.has('page') && !isNaN(Number(queries.get('page'))) ? Number(queries.get('page')) : 1;

		const res = await getPosts(session.accessToken, page);
		return {
			props: {
				posts: res.posts,
				page,
				maxPage: res.totalPage
			}
		};
	};
</script>

<script lang="ts">
	import { getStores } from '$app/stores';
	import { get } from 'svelte/store';
	import { getPosts } from '$lib/apis/postApi';
	import type { Post } from '$lib/domain/post';
	import PostCard from '$lib/components/blocks/PostCard.svelte';
	import Heading from '$lib/components/atoms/Heading.svelte';
	import PagingNav from '$lib/components/blocks/PagingNav.svelte';
	import { goto } from '$app/navigation';
	import type { AppStoreType } from '$lib/stores/AppStore';
	import AddFab from '$lib/components/atoms/AddFab.svelte';

	export let posts: Post[] = [];
	export let page: number = 1;
	export let maxPage = 1;

	const appStore = get<AppStoreType>(getStores().session);

	const onFavoriteChanged = (i: number, post: Post) => {
		if (appStore.accessToken === '') {
			goto(`/auth/login?redirectUrl=${location.pathname}`);
			return;
		}
		console.log('Favorited');
	};

	const onPageChanged = (page: number) => {
		goto(`/posts?page=${page + 1}`);
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
	{#if posts.length > 0}
		<PagingNav currentPage={page - 1} {maxPage} displayNum={2} {onPageChanged} />
	{/if}
	<AddFab on:click={() => goto('/posts/add')} />
</section>

<style>
	.card-container {
		margin-bottom: 20px;
	}
</style>
