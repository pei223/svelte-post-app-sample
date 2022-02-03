<script lang="ts">
	import { ErrorInfo, ERROR_CODE } from '$lib/domain/error';
	import Heading from '../atoms/Heading.svelte';

	export let errorInfo: ErrorInfo;
	type Content = {
		title: string;
		message: string;
	};

	const getContent = (errorInfo: ErrorInfo): Content => {
		if (errorInfo.status === 404) {
			return {
				title: '404',
				message: '存在しないデータです'
			};
		}
		if (errorInfo.code === ERROR_CODE.networkError) {
			return {
				title: 'ネットワークエラー',
				message: '接続を確認してください'
			};
		}
		return {
			title: '500',
			message: '予期しないエラーが発生しました'
		};
	};
	$: content = getContent(errorInfo);
</script>

<Heading title={content.title} />
<p>{content.message}</p>
