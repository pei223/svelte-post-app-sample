<script lang="ts">
	import Fab, { Icon } from '@smui/fab';
	export let right = '50px';
	export let bottom = '50px';
</script>

<div class="fab-container" style={`right: ${right};bottom: ${bottom}`}>
	<Fab on:click>
		<Icon class="material-icons">add</Icon>
	</Fab>
</div>

<style>
	.fab-container {
		position: fixed;
	}
</style>
