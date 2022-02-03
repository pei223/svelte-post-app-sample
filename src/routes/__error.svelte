<script context="module" lang="ts">
	import type { ErrorLoad } from '@sveltejs/kit';

	export const load: ErrorLoad = ({ error, status, url }) => {
		const errorInfo = ErrorInfo.fromError(error, url.pathname);
		return {
			props: {
				errorInfo
			}
		};
	};
</script>

<script lang="ts">
	import ErrorView from '$lib/components/blocks/ErrorView.svelte';
	import { ErrorInfo } from '$lib/domain/error';

	export let errorInfo;
</script>

<ErrorView {errorInfo} />
