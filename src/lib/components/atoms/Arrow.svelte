<script lang="ts">
	export let direction: 'left' | 'right' = 'left';
	export let color = '';
	export let size = '18px';
	export let thin = '4px';
	export let onClick: () => void = null;
	export let style = '';

	const styleMap = {
		left: `border-left: ${thin} solid ${color}; border-bottom: ${thin} solid ${color};`,
		right: `border-top: ${thin} solid ${color}; border-right: ${thin} solid ${color};`
	};
</script>

<div
	class="arrow"
	on:click={onClick}
	style={`width: ${size}; height: ${size}; ${styleMap[direction]} ${style}`}
/>

<style>
	.arrow {
		display: inline-block;
		transform: rotate(45deg);
	}
</style>
