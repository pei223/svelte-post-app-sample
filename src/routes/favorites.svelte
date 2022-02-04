<script context="module" lang="ts">
	import type { Load } from '@sveltejs/kit';
	export const load: Load = async ({ url }) => {
		const queries = new URLSearchParams(url.search);
		const page =
			queries.has('page') && !isNaN(Number(queries.get('page'))) ? Number(queries.get('page')) : 1;

		return {
			props: {
				page
			}
		};
	};
</script>

<script lang="ts">
	import type { Favorite } from '$lib/domain/Favorite';
	import { AppStoreType, AppStoreWrapper } from '$lib/stores/AppStore';
	import { session } from '$app/stores';
	import { get } from 'svelte/store';
	import { deleteFavorite, getFavorites } from '$lib/apis/favoriteApi';
	import { goto } from '$app/navigation';
	import axios from 'axios';
	import { ERROR_CODE, genErrorPath } from '$lib/domain/error';
	import type { ErrorResponse } from '$lib/apis/ErrorResponse';
	import CookieService from '$lib/services/CookieService';
	import Heading from '$lib/components/atoms/Heading.svelte';
	import PagingNav from '$lib/components/blocks/PagingNav.svelte';
	import FavoritePostCard from '$lib/components/blocks/FavoritePostCard.svelte';
	import LoadingScreen from '$lib/components/atoms/LoadingScreen.svelte';

	let posts: Favorite[] = [];
	export let page = 1;
	let maxPage = 1;
	let loading = true;

	const appStore = get<AppStoreType>(session);

	$: {
		fetchFavoritePosts(page);
	}

	const onPageChanged = (page: number) => {
		goto(`/favorites?page=${page + 1}`);
	};

	const doDeleteFavorite = async (i: number, post: Favorite) => {
		if (appStore.accessToken === '') {
			goto(`/auth/login?redirectUrl=${location.pathname}`);
			return;
		}
		try {
			await deleteFavorite(appStore.accessToken, post.postId);
			posts.splice(i, 1);
			posts = posts;
		} catch (e) {
			if (!axios.isAxiosError(e)) {
				goto(genErrorPath(this.$route.path, ERROR_CODE.notAxiosError));
				return;
			}
			if (!e.response) {
				goto(genErrorPath(this.$route.path, ERROR_CODE.networkError));
				return;
			}
			switch (e.response.status) {
				case 400:
					goto(genErrorPath(this.$route.path, ERROR_CODE.paramError));
					break;
				case 401:
					goto(`/auth/login?redirectUrl=${location.pathname}`);
					return;
				case 404:
					goto(`/404`);
					return;
				default:
					goto(genErrorPath(this.$route.path, ERROR_CODE.unexpectedApiError));
			}
		}
	};

	const fetchFavoritePosts = async (page: number) => {
		loading = true;
		if (appStore.accessToken === '') {
			goto(`/auth/login?redirectUrl=${location.pathname}`);
			return;
		}
		try {
			const res = await getFavorites(appStore.accessToken, page);
			posts = res.favorites;
			maxPage = res.totalPage;
		} catch (e) {
			if (!axios.isAxiosError(e)) {
				goto(genErrorPath(location.pathname, ERROR_CODE.notAxiosError));
				return;
			}
			if (!e.response) {
				goto(genErrorPath(location.pathname, ERROR_CODE.networkError));
				return;
			}
			const errorResponse = e.response.data as ErrorResponse;
			switch (e.response.status) {
				case 401:
					new AppStoreWrapper(session, new CookieService()).clear();
					goto(`/auth/login?redirectUrl=${location.pathname}`);
					return;
				default:
					goto(genErrorPath(location.pathname, ERROR_CODE.unexpectedApiError));
			}
		} finally {
			loading = false;
		}
	};
</script>

<svelte:head>
	<title>お気に入り記事一覧</title>
</svelte:head>
<section>
	<Heading title="お気に入り記事一覧" />
	{#if !loading}
		{#each posts as post, i}
			<div class="card-container">
				<FavoritePostCard {post} {i} onDelete={doDeleteFavorite} />
			</div>
		{:else}
			<div>データはありません</div>
		{/each}
		{#if posts}
			<PagingNav currentPage={page - 1} {maxPage} displayNum={2} {onPageChanged} />
		{/if}
	{/if}
</section>

<LoadingScreen open={loading} />
