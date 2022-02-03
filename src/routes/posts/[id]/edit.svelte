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
	import { AppStoreType, AppStoreWrapper } from '$lib/stores/AppStore';
	import { onMount } from 'svelte';
	import { get } from 'svelte/store';
	import type { MyPost } from '$lib/domain/post';
	import axios from 'axios';
	import { ERROR_CODE, genErrorPath } from '$lib/domain/error';
	import LoadingScreen from '$lib/components/atoms/LoadingScreen.svelte';
	import CookieService from '$lib/services/CookieService';

	export let id = 0;
	let post: MyPost;
	let loading = true;

	const appStore = get<AppStoreType>(session);
	onMount(async () => {
		if (appStore.accessToken === '') {
			goto(`/auth/login?redirectUrl=${location.pathname}`);
			return;
		}
		try {
			const res = await findPost(appStore.accessToken, id);
			post = res;
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
					new AppStoreWrapper(session, new CookieService()).clear();
					goto(`/auth/login?redirectUrl=${location.pathname}`);
					return;
				case 404:
					goto('/404');
					return;
				default:
					goto(genErrorPath(this.$route.path, ERROR_CODE.unexpectedApiError));
			}
		} finally {
			loading = false;
		}
	});
</script>

<LoadingScreen open={loading} />
{#if post}
	<PostForm edit={true} {post} />
{/if}
