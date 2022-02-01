<script lang="ts">
	import CircularProgress from '@smui/circular-progress';
	export let open = false;
</script>

{#if open}
	<div class="loading-container">
		<CircularProgress style="height: 90px; width: 90px;" indeterminate />
	</div>
{/if}

<style>
	.loading-container {
		display: flex;
		justify-content: center;
		align-items: center;
		position: fixed;
		z-index: 999;
		width: 100vw;
		height: 100vh;
		top: 0;
		left: 0;
	}
</style>
