<script lang="ts">
	import { goto } from '$app/navigation';

	import { session } from '$app/stores';
	import type { ErrorResponse } from '$lib/apis/ErrorResponse';
	import { PostBody, registerPost, updatePost } from '$lib/apis/postApi';
	import { ErrorInfo, ERROR_CODE } from '$lib/domain/error';
	import type { MyPost } from '$lib/domain/post';
	import type { AppStoreType } from '$lib/stores/AppStore';
	import Dialog, { Title, Content, Actions } from '@smui/dialog';
	import Button, { Label } from '@smui/button';

	import { onMount } from 'svelte';
	import { get } from 'svelte/store';
	import Textfield from '@smui/textfield';
	import CharacterCounter from '@smui/textfield/character-counter';
	import { marked } from 'marked';
	import HelperText from '@smui/textfield/helper-text';
	import Checkbox from '@smui/checkbox';
	import FormField from '@smui/form-field';
	import Heading from '../atoms/Heading.svelte';
	import LoadingScreen from '../atoms/LoadingScreen.svelte';

	export let edit = false;
	export let post: MyPost = undefined;
	let title = '';
	let content = '';
	let expose = false;
	let errorDialogOpen = false;
	let errorDialogMessage = '';
	let titleErrorMessage = '';
	let contentErrorMessage = '';
	let loading = false;
	let textAreaHeight = 0;
	const appStore = get<AppStoreType>(session);
	$: contentView = marked.parse(content);
	onMount(() => {
		if (appStore.accessToken === '') {
			goto(`/auth/login?redirectUrl=${location.pathname}`);
			return;
		}
		if (post) {
			title = post.title;
			content = post.content;
			expose = post.expose;
		}
	});
	const validateTitle = (): boolean => {
		if (title === '') {
			titleErrorMessage = '入力してください';
			return false;
		}
		return true;
	};
	const validateContent = (): boolean => {
		if (content === '') {
			contentErrorMessage = '入力してください';
			return false;
		}
		return true;
	};
	const submit = async () => {
		const isTitleValid = validateTitle();
		const isContentValid = validateContent();
		if (!isTitleValid || !isContentValid) {
			return;
		}
		try {
			loading = true;
			const body: PostBody = {
				title,
				content,
				expose
			};
			if (edit) {
				await updatePost(appStore.accessToken, post.id, body);
			} else {
				await registerPost(appStore.accessToken, body);
			}
			goto('/posts/me');
		} catch (e) {
			const errorInfo = ErrorInfo.fromError(location.pathname, e);
			if (errorInfo.code === ERROR_CODE.paramError) {
				const errorRes = e.response.data as ErrorResponse;
				// TODO 重複の場合エラーコードが変わるがバックエンド側がまだそこまでできてない
				this.titleErrorMessage = errorRes.data.title ?? '';
				this.contentErrorMessage = errorRes.data.content ?? '';
				return;
			}
			if (errorInfo.code === ERROR_CODE.authError) {
				errorDialogOpen = true;
				errorDialogMessage = '認証に失敗しました。ログアウトして再ログインしてください。';
				return;
			}
			if (errorInfo.code === ERROR_CODE.notFound) {
				errorDialogOpen = true;
				errorDialogMessage = '更新対象の記事は存在しません。';
				return;
			}
			goto(errorInfo.genErrorPagePath());
		} finally {
			loading = false;
		}
	};
</script>

<Heading title={edit ? '記事編集' : '記事登録'} />
<section>
	<Textfield
		style="width: 100%"
		on:focus={() => (titleErrorMessage = '')}
		invalid={titleErrorMessage !== ''}
		bind:value={title}
		label="タイトル"
	>
		<HelperText persistent slot="helper" style="color: red">{titleErrorMessage}</HelperText>
	</Textfield>
</section>
<section class="content-area">
	<div
		class="input-content"
		bind:offsetHeight={textAreaHeight}
		on:scroll={() => console.log('aaa')}
	>
		<Textfield
			style="width: 100%"
			textarea
			input$rows={20}
			input$maxlength={10000}
			bind:value={content}
			label="記事内容"
			invalid={contentErrorMessage !== ''}
			on:scroll={(e) => {
				console.log(e.target);
			}}
			on:focus={() => (contentErrorMessage = '')}
		>
			<CharacterCounter slot="internalCounter">0</CharacterCounter>
			<HelperText persistent slot="helper" style="color: red">{contentErrorMessage}</HelperText>
		</Textfield>
	</div>
	<div class="content-view" style={`height: ${textAreaHeight}px`}>
		<p>記事の見た目</p>
		{@html contentView}
	</div>
</section>
<section>
	<FormField align="end">
		<Checkbox bind:checked={expose} />
		<span slot="label">記事を公開</span>
	</FormField>
</section>
<section>
	<Button on:click={submit} variant="raised" style="padding: 10px">
		<Label>{edit ? '更新' : '登録'}</Label>
	</Button>
</section>

<Dialog
	bind:open={errorDialogOpen}
	aria-labelledby="dialog-title"
	aria-describedby="dialog-content"
>
	<Title id="dialog-title">{edit ? '更新' : '登録'}エラー</Title>
	<Content id="dialog-content">{errorDialogMessage}</Content>
	<Actions>
		<Button on:click={() => (errorDialogOpen = false)}>
			<Label>OK</Label>
		</Button>
	</Actions>
</Dialog>

<LoadingScreen open={loading} />

<style>
	.content-area {
		margin-top: 30px;
		display: flex;
		justify-content: center;
		align-items: baseline;
	}
	.input-content {
		margin-right: 40px;
		width: 50%;
	}
	.content-view {
		overflow-y: scroll;
		word-wrap: break-word;
		width: 50%;
	}
</style>
