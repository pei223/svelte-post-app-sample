<script context="module" lang="ts">
	import type { Load } from '@sveltejs/kit';

	export const prerender = true;
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
	import { goto } from '$app/navigation';
	import { getStores } from '$app/stores';
	import { deletePost, getMyPosts } from '$lib/apis/postApi';
	import type { MyPost } from '$lib/domain/post';
	import { AppStoreType, AppStoreWrapper } from '$lib/stores/AppStore';
	import { get } from 'svelte/store';
	import { onMount } from 'svelte';
	import Dialog, { Title, Content, Actions } from '@smui/dialog';
	import Button, { Label } from '@smui/button';
	import Heading from '$lib/components/atoms/Heading.svelte';
	import PagingNav from '$lib/components/blocks/PagingNav.svelte';
	import { ERROR_CODE, genErrorPath } from '$lib/domain/error';
	import type { ErrorResponse } from '$lib/apis/ErrorResponse';
	import axios from 'axios';
	import Loading from '$lib/components/atoms/LoadingScreen.svelte';
	import MyPostCard from '$lib/components/blocks/MyPostCard.svelte';
	import { browser } from '$app/env';
	import AddFab from '$lib/components/atoms/AddFab.svelte';
	import CookieService from '$lib/services/CookieService';

	let posts: MyPost[] = [];
	export let page = 1;
	let maxPage = 1;
	let loading = true;
	let deleteConfirmDialogOpen = false;
	let deleteTargetIndex = -1;

	const appStore = get<AppStoreType>(getStores().session);

	$: {
		if (browser) {
			fetchPost(page);
		}
	}
	$: deleteTargetPost = posts ? posts[deleteTargetIndex] : null;
	onMount(async () => {
		fetchPost(page);
	});

	const fetchPost = async (page: number) => {
		loading = true;
		if (appStore.accessToken === '') {
			goto(`/auth/login?redirectUrl=${location.pathname}`);
			return;
		}
		try {
			const res = await getMyPosts(appStore.accessToken, page);
			posts = res.posts;
			maxPage = res.totalPage;
		} catch (e) {
			console.log(e);
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
					new AppStoreWrapper(appStore, new CookieService()).clear();
					goto(`/auth/login?redirectUrl=${location.pathname}`);
					return;
				default:
					goto(genErrorPath(location.pathname, ERROR_CODE.unexpectedApiError));
			}
		} finally {
			loading = false;
		}
	};

	const onPageChanged = (page: number) => {
		goto(`/posts/me?page=${page + 1}`);
	};

	const confirmDelete = (i: number, post: MyPost) => {
		deleteTargetIndex = i;
		deleteConfirmDialogOpen = true;
	};

	const doDeletePost = async () => {
		if (deleteTargetIndex < 0) {
			return;
		}
		try {
			loading = true;
			await deletePost(appStore.accessToken, deleteTargetPost.id);
			loading = false;
			posts.splice(deleteTargetIndex, 1);
			posts = posts;
			deleteTargetIndex = -1;
			deleteConfirmDialogOpen = false;
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
				case 401:
					goto(`/auth/login?redirectUrl=${location.hostname}`);
					return;
				case 404:
					goto('/404');
					return;
				default:
					goto(genErrorPath(this.$route.path, ERROR_CODE.unexpectedApiError));
			}
		}
	};
</script>

<svelte:head>
	<title>自分の記事</title>
</svelte:head>

<section>
	<Heading title="自分の記事" />
	{#if !loading}
		{#each posts as post, i}
			<div class="card-container">
				<MyPostCard {post} {i} onDeleteClicked={confirmDelete} />
			</div>
		{:else}
			<div>データはありません</div>
		{/each}
		{#if posts}
			<PagingNav currentPage={page - 1} {maxPage} displayNum={2} {onPageChanged} />
		{/if}
		<AddFab on:click={() => goto('/posts/add')} />
	{/if}
</section>

{#if deleteTargetPost}
	<Dialog
		bind:open={deleteConfirmDialogOpen}
		aria-labelledby="dialog-title"
		aria-describedby="dialog-content"
	>
		<Title id="dialog-title">削除確認</Title>
		<Content id="dialog-content">[{deleteTargetPost.title}]を削除します。よろしいですか？</Content>
		<Actions>
			<Button on:click={doDeletePost}>
				<Label>OK</Label>
			</Button>
			<Button
				on:click={() => {
					deleteConfirmDialogOpen = false;
					deleteTargetIndex = -1;
				}}
			>
				<Label>Cancel</Label>
			</Button>
		</Actions>
	</Dialog>
{/if}

<Loading open={loading} />

<style>
	.card-container {
		margin-bottom: 20px;
	}
</style>
