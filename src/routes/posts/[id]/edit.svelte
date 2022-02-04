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
	import { goto } from '$app/navigation';

	import { session } from '$app/stores';
	import { findPost } from '$lib/apis/postApi';

	import PostForm from '$lib/components/templates/PostForm.svelte';
	import { AppStoreType, AppStoreWrapper } from '$lib/stores/AppStore';
	import { onMount } from 'svelte';
	import { get } from 'svelte/store';
	import type { MyPost } from '$lib/domain/post';
	import { ErrorInfo, ERROR_CODE } from '$lib/domain/error';
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
			const errInfo = ErrorInfo.fromError(location.pathname, e);
			if (errInfo.code === ERROR_CODE.authError) {
				new AppStoreWrapper(session, new CookieService()).clear();
			}
			goto(errInfo.genErrorPagePath());
		} finally {
			loading = false;
		}
	});
</script>

<LoadingScreen open={loading} />
{#if post}
	<PostForm edit={true} {post} />
{/if}
