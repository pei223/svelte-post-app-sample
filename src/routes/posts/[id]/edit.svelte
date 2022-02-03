<script context="module" lang="ts">
	import type { Load } from '@sveltejs/kit';

	export const load: Load = ({ url, params }) => {
		if (!params.id || isNaN(Number(params.id))) {
			return {
				status: 404
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
	import { goto } from '$app/navigation';

	import { session } from '$app/stores';
	import { findPost } from '$lib/apis/postApi';

	import PostForm from '$lib/components/templates/PostForm.svelte';
	import type { AppStoreType } from '$lib/stores/AppStore';
	import { onMount } from 'svelte';
	import { get } from 'svelte/store';
	import type { MyPost } from '$lib/domain/post';
	import LoadingScreen from '$lib/components/atoms/LoadingScreen.svelte';

	export let id = 0;
	let post: MyPost;
	let loading = true;

	const appStore = get<AppStoreType>(session);
	onMount(async () => {
		if (appStore.accessToken === '') {
			goto(`/auth/login?redirectUrl=${location.pathname}`);
			return;
		}
		const res = await findPost(appStore.accessToken, id);
		post = res;
		loading = false;
	});
</script>

<LoadingScreen open={loading} />
{#if post}
	<PostForm edit={true} {post} />
{/if}
