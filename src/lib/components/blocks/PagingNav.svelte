<script lang="ts">
	import Arrow from '../atoms/Arrow.svelte';

	export let currentPage = 1;
	export let maxPage = 1;
	export let displayNum = 3;
	export let onPageChanged: (page: number) => void;

	const calcPageList = (currentPage, maxPage) => {
		const startPage = Math.max(
			currentPage - displayNum - Math.max(currentPage - (maxPage - 1) + displayNum, 0),
			0
		);
		const endPage = Math.min(
			currentPage + displayNum + Math.max(displayNum - currentPage, 0),
			maxPage - 1
		);
		const pageList = [];
		for (let i = startPage; i <= endPage; i++) {
			pageList.push(i);
		}
		return pageList;
	};

	const changePage = (page: number) => {
		if (page < 0 || page >= maxPage) {
			return;
		}
		onPageChanged(page);
	};

	$: pageList = calcPageList(currentPage, maxPage);
</script>

<div class="container">
	<Arrow
		style="cursor: pointer;"
		color="#c4c4c4"
		size="12px"
		thin="3px"
		direction="left"
		onClick={() => changePage(currentPage - 1)}
	/>
	{#each pageList as page}
		<span class={'page ' + (page === currentPage && 'selected')} on:click={() => changePage(page)}
			>{page + 1}</span
		>
	{/each}

	<Arrow
		style="cursor: pointer;"
		color="#c4c4c4"
		size="12px"
		thin="3px"
		direction="right"
		onClick={() => changePage(currentPage + 1)}
	/>
</div>

<style>
	.container {
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.page {
		width: 35px;
		text-align: center;
		padding: 8px 0;
		margin: 0 5px;
		border-radius: 3px;
		background-color: #7986cb;
		color: white;
		font-size: 16px;
		cursor: pointer;
	}
	.page:hover {
		background-color: #9fa8da;
	}
	.selected {
		background-color: #3f51b5;
	}
</style>
