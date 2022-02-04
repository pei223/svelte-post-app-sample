<script context="module" lang="ts">
	import type { Load } from '@sveltejs/kit';
	export const load: Load = async ({ url, session }) => {
		const queries = new URLSearchParams(url.search);
		const page =
			queries.has('page') && !isNaN(Number(queries.get('page'))) ? Number(queries.get('page')) : 1;
		try {
			const res = await getPosts(session.accessToken, page);
			return {
				props: {
					posts: res.posts,
					page,
					maxPage: res.totalPage
				}
			};
		} catch (e) {
			const errInfo = ErrorInfo.fromError(location.pathname, e);
			return {
				redirect: errInfo.genErrorPagePath()
			};
		}
	};
</script>

<script lang="ts">
	import { getStores, session } from '$app/stores';
	import { get } from 'svelte/store';
	import { getPosts } from '$lib/apis/postApi';
	import type { Post } from '$lib/domain/post';
	import PostCard from '$lib/components/blocks/PostCard.svelte';
	import Heading from '$lib/components/atoms/Heading.svelte';
	import PagingNav from '$lib/components/blocks/PagingNav.svelte';
	import { goto } from '$app/navigation';
	import { AppStoreType, AppStoreWrapper } from '$lib/stores/AppStore';
	import AddFab from '$lib/components/atoms/AddFab.svelte';
	import { addFavorite, deleteFavorite } from '$lib/apis/favoriteApi';
	import { ErrorInfo, ERROR_CODE } from '$lib/domain/error';
	import CookieService from '$lib/services/CookieService';

	export let posts: Post[] = [];
	export let page: number = 1;
	export let maxPage = 1;

	const appStore = get<AppStoreType>(getStores().session);

	const onFavoriteChanged = async (i: number, post: Post) => {
		if (appStore.accessToken === '') {
			goto(`/auth/login?redirectUrl=${location.pathname}`);
			return;
		}
		try {
			post.favorited
				? await deleteFavorite(appStore.accessToken, post.id)
				: await addFavorite(appStore.accessToken, post.id);
			posts[i].favorited = !posts[i].favorited;
			posts = posts;
		} catch (e) {
			const errInfo = ErrorInfo.fromError(location.pathname, e);
			if (errInfo.code === ERROR_CODE.authError) {
				new AppStoreWrapper(session, new CookieService()).clear();
			}
			goto(errInfo.genErrorPagePath());
		}
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
