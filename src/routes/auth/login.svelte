<script lang="ts">
	import Textfield from '@smui/textfield';
	import Button, { Label } from '@smui/button';
	import HelperText from '@smui/textfield/helper-text';
	import Heading from '$lib/components/atoms/Heading.svelte';
	import { loginRequest } from '$lib/apis/authApi';
	import { get } from 'svelte/store';
	import { session } from '$app/stores';
	import { AppStoreType, AppStoreWrapper } from '$lib/stores/AppStore';
	import { goto } from '$app/navigation';
	import axios from 'axios';
	import { ERROR_CODE, genErrorPath } from '$lib/domain/error';
	import type { ErrorResponse } from '$lib/apis/ErrorResponse';
	import { base } from '$app/paths';
	import CookieService from '$lib/services/CookieService';

	let name = '';
	let password = '';
	let nameErrorMessage = '';
	let passwordErrorMessage = '';

	const appStore = get<AppStoreType>(session);
	const fieldStyle = 'width: 60%;';

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
			const res = await loginRequest({
				name,
				password
			});
			const appStoreWrapper = new AppStoreWrapper(appStore, new CookieService());
			appStoreWrapper.setToken(res.token);
			appStoreWrapper.setUser({
				name: res.name,
				id: res.id,
				email: res.email
			});
			const queries = new URLSearchParams(location.search);
			const redirectUrl = queries.has('redirectUrl') ? queries.get('redirectUrl') : '/posts/me';
			goto(redirectUrl);
		} catch (e) {
			console.log(e);
			if (!axios.isAxiosError(e)) {
				goto(genErrorPath(base, ERROR_CODE.notAxiosError));
				return;
			}
			if (!e.response) {
				goto(genErrorPath(base, ERROR_CODE.networkError));
				return;
			}
			const errorResponse = e.response.data as ErrorResponse;
			switch (e.response.status) {
				case 401:
					// this.errorDialogOpen = true;
					// this.errorDialogMessage = '認証エラー';
					return;
				case 400:
					nameErrorMessage = errorResponse.data.name ?? '';
					passwordErrorMessage = errorResponse.data.password ?? '';
					return;
				default:
					goto(genErrorPath(base, ERROR_CODE.unexpectedApiError));
			}
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
			<HelperText persistent slot="helper">{nameErrorMessage}</HelperText>
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
			<HelperText persistent slot="helper">{passwordErrorMessage}</HelperText>
		</Textfield>
	</div>
</div>

<Button color="secondary" on:click={login} variant="raised">
	<Label>ログイン</Label>
</Button>

<style>
	.field-area {
		padding-bottom: 20px;
	}
	.fields-area {
		margin-bottom: 50px;
	}
</style>
