<script context="module" lang="ts">
	import type { Load } from '@sveltejs/kit';

	export const load: Load = ({ url, params }) => {
		if (!params.id || isNaN(Number(params.id))) {
			return {
				redirect: ErrorInfo.fromHttpStatus(url.pathname, 404).genErrorPagePath()
			};
		}
		return {
			props: {
				id: Number(params.id)
			}
		};
	};
</script>

<script lang="ts">
	import { findPost } from '$lib/apis/postApi';
	import type { AppStoreType } from '$lib/stores/AppStore';
	import { get } from 'svelte/store';
	import { onMount } from 'svelte';
	import { session } from '$app/stores';
	import { goto } from '$app/navigation';
	import type { MyPost } from '$lib/domain/post';
	import { ErrorInfo } from '$lib/domain/error';
	import LoadingScreen from '$lib/components/atoms/LoadingScreen.svelte';
	import Heading from '$lib/components/atoms/Heading.svelte';
	import { marked } from 'marked';
	import Button from '@smui/button/src/Button.svelte';
	import { Icon } from '@smui/icon-button';

	export let id: number = 0;
	let post: MyPost;
	let loading = true;
	const appStore = get<AppStoreType>(session);

	$: parsedContent = post ? marked.parse(post.content) : '';
	$: isEditable = appStore.currentUser && post && appStore.currentUser.id === post.author.id;

	const goEditPage = () => {
		if (!isEditable) {
			return;
		}
		goto(`/posts/${id}/edit`);
	};

	onMount(async () => {
		try {
			const res = await findPost(appStore.accessToken, id);
			post = res;
		} catch (e) {
			const errInfo = ErrorInfo.fromError(location.pathname, e);
			goto(errInfo.genErrorPagePath());
		} finally {
			loading = false;
		}
	});
</script>

<svelte:head>
	<title>{post ? post.title : '記事詳細'}</title>
</svelte:head>

<Heading title={post?.title} />
{#if !loading && post}
	<h2>{post.title}</h2>
	<div class="actions-area">
		{#if !post.expose}
			<div class="no-expose">
				<Icon class="material-icons">lock</Icon>
				<span> 非公開</span>
			</div>
		{/if}
		{#if isEditable}
			<Button variant="raised" on:click={goEditPage}>編集</Button>
		{/if}
	</div>
	<div>{@html parsedContent}</div>
{/if}
<LoadingScreen open={loading} />

<style>
	.actions-area {
		display: flex;
		align-items: center;
	}
	.no-expose {
		display: flex;
		align-items: center;
		padding: 7px;
		border-radius: 5px;
		border: 1px gray solid;
		margin-right: 20px;
	}
</style>
