<script context="module" lang="ts">
	import type { Load } from '@sveltejs/kit';
	export const load: Load = async ({ url }) => {
		const queries = new URLSearchParams(url.search);
		const redirectUrl = queries.has('redirectUrl') ? queries.get('redirectUrl') : null;

		return {
			props: {
				redirectUrl
			}
		};
	};
</script>

<script lang="ts">
	import Textfield from '@smui/textfield';
	import Button, { Label } from '@smui/button';
	import HelperText from '@smui/textfield/helper-text';
	import Heading from '$lib/components/atoms/Heading.svelte';
	import { loginRequest } from '$lib/apis/authApi';
	import type { Writable } from 'svelte/store';
	import { session } from '$app/stores';
	import { AppStoreType, AppStoreWrapper } from '$lib/stores/AppStore';
	import { goto } from '$app/navigation';
	import axios from 'axios';
	import { ErrorInfo, ERROR_CODE } from '$lib/domain/error';
	import CookieService from '$lib/services/CookieService';
	import LoadingScreen from '$lib/components/atoms/LoadingScreen.svelte';
	import Snackbar, { Label as SnackbarLabel, SnackbarComponentDev } from '@smui/snackbar';
	import type { ErrorResponse } from '$lib/apis/ErrorResponse';

	export let redirectUrl: string | null = null;
	let name = '';
	let password = '';
	let nameErrorMessage = '';
	let passwordErrorMessage = '';
	let loading = false;
	let snackbarCtrl: SnackbarComponentDev;

	const appStore: Writable<AppStoreType> = session;
	const fieldStyle = 'width: 60%;';

	$: {
		if (redirectUrl != null && snackbarCtrl) {
			snackbarCtrl.open();
		}
	}

	const login = async () => {
		if (name === '') {
			nameErrorMessage = '入力してください';
			return;
		}
		if (password === '') {
			passwordErrorMessage = '入力してください';
			return;
		}
		try {
			loading = true;
			const res = await loginRequest({
				name,
				password
			});
			const appStoreWrapper = new AppStoreWrapper(appStore, new CookieService());
			appStoreWrapper.set(res.token, {
				name: res.name,
				id: res.id,
				email: res.email
			});
			goto(redirectUrl ?? '/posts/me');
		} catch (e) {
			if (!ErrorInfo.isHttpError(e)) {
				goto(ErrorInfo.fromError(location.pathname, e).genErrorPagePath());
			}
			const errorRes = e.response.data as ErrorResponse;
			if (e.response.status == 400) {
				nameErrorMessage = errorRes.data.name ?? '';
				passwordErrorMessage = errorRes.data.password ?? '';
				return;
			}
			if (e.response.status === 401) {
				// TODO 認証エラーダイアログ
				console.log('auth failed');
				return;
			}
			goto(ErrorInfo.fromError(location.pathname, e).genErrorPagePath());
		} finally {
			loading = false;
		}
	};
</script>

<Heading title="ログイン" />
<div class="fields-area">
	<div class="field-area">
		<Textfield
			on:focus={() => (nameErrorMessage = '')}
			invalid={nameErrorMessage !== ''}
			bind:value={name}
			label="名前"
			style={fieldStyle}
		>
			<HelperText persistent slot="helper" style="color: red">{nameErrorMessage}</HelperText>
		</Textfield>
	</div>

	<div class="field-area">
		<Textfield
			on:focus={() => (passwordErrorMessage = '')}
			label="パスワード"
			type="password"
			invalid={passwordErrorMessage !== ''}
			bind:value={password}
			style={fieldStyle}
		>
			<HelperText persistent slot="helper" style="color: red">{passwordErrorMessage}</HelperText>
		</Textfield>
	</div>
</div>

<Button color="secondary" on:click={login} variant="raised">
	<Label>ログイン</Label>
</Button>
<LoadingScreen open={loading} />

<Snackbar bind:this={snackbarCtrl}>
	<SnackbarLabel>ログインしてください。</SnackbarLabel>
</Snackbar>

<style>
	.field-area {
		padding-bottom: 20px;
	}
	.fields-area {
		margin-bottom: 50px;
	}
</style>
