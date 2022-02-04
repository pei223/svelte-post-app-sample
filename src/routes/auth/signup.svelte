<script lang="ts">
	import Textfield from '@smui/textfield';
	import Button, { Label } from '@smui/button';
	import HelperText from '@smui/textfield/helper-text';
	import Heading from '$lib/components/atoms/Heading.svelte';
	import { signupRequest } from '$lib/apis/authApi';
	import type { Writable } from 'svelte/store';
	import { session } from '$app/stores';
	import { AppStoreType, AppStoreWrapper } from '$lib/stores/AppStore';
	import { goto } from '$app/navigation';
	import { ErrorInfo, ERROR_CODE } from '$lib/domain/error';
	import type { ErrorResponse } from '$lib/apis/ErrorResponse';
	import CookieService from '$lib/services/CookieService';
	import { load } from './login.svelte';
	import LoadingScreen from '$lib/components/atoms/LoadingScreen.svelte';

	let name = '';
	let password = '';
	let email = '';
	let loading = false;
	let nameErrorMessage = '';
	let passwordErrorMessage = '';
	let emailErrorMessage = '';

	const appStore: Writable<AppStoreType> = session;
	const fieldStyle = 'width: 60%';

	const signup = async () => {
		if (name === '') {
			nameErrorMessage = '入力してください';
			return;
		}
		if (password === '') {
			passwordErrorMessage = '入力してください';
			return;
		}
		if (email === '') {
			emailErrorMessage = '入力してください';
			return;
		}
		loading = true;
		try {
			const res = await signupRequest({
				name,
				password,
				email
			});
			const appStoreWrapper = new AppStoreWrapper(appStore, new CookieService());
			appStoreWrapper.set(res.token, {
				name: res.name,
				id: res.id,
				email: res.email
			});
			goto('/posts/me');
		} catch (e) {
			const errorInfo = ErrorInfo.fromError(location.pathname, e);
			if (errorInfo.code === ERROR_CODE.paramError) {
				const errorRes = e.response.data as ErrorResponse;
				nameErrorMessage = errorRes.data.name ?? '';
				emailErrorMessage = errorRes.data.email ?? '';
				passwordErrorMessage = errorRes.data.password ?? '';
				return;
			}
			goto(errorInfo.genErrorPagePath());
		} finally {
			loading = false;
		}
	};
</script>

<Heading title="登録" />
<div class="fields-area">
	<div class="field-area">
		<Textfield
			on:focus={() => (emailErrorMessage = '')}
			bind:value={email}
			label="e-mail"
			style={fieldStyle}
			invalid={emailErrorMessage !== ''}
		>
			<HelperText persistent slot="helper" style="color: red">{emailErrorMessage}</HelperText>
		</Textfield>
	</div>
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

<Button color="primary" on:click={signup} variant="raised">
	<Label>登録</Label>
</Button>

<LoadingScreen open={loading} />

<style>
	.field-area {
		padding-bottom: 20px;
	}
	.fields-area {
		margin-bottom: 50px;
	}
</style>
