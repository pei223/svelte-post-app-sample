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
	import { ErrorInfo, ERROR_CODE } from '$lib/domain/error';
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
			// TODO お気に入り削除失敗ダイアログ
			const errInfo = ErrorInfo.fromError(location.pathname, e);
			if (errInfo.code === ERROR_CODE.authError) {
				new AppStoreWrapper(session, new CookieService()).clear();
			}
			goto(errInfo.genErrorPagePath());
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
			const errInfo = ErrorInfo.fromError(location.pathname, e);
			if (errInfo.code === ERROR_CODE.authError) {
				new AppStoreWrapper(session, new CookieService()).clear();
			}
			goto(errInfo.genErrorPagePath());
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
