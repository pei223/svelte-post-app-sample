<script context="module" lang="ts">
	import { ErrorInfo } from '$lib/domain/error';

	import type { Load } from '@sveltejs/kit';
	export const load: Load = async ({ url }) => {
		const queries = new URLSearchParams(url.search);
		const errorParam = queries.has('param') ? queries.get('param') : '';
		const errorInfo = ErrorInfo.parseFromErrorParam(errorParam);
		return {
			props: {
				errorInfo
			}
		};
	};
</script>

<script lang="ts">
	import Heading from '$lib/components/atoms/Heading.svelte';

	export let errorInfo: ErrorInfo;
</script>

{#if errorInfo}
	<Heading title={errorInfo.errorMessage().title} />
	<p>{errorInfo.errorMessage().message}</p>
{/if}
