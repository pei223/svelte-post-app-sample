<script lang="ts">
	import Ripple from '@smui/ripple';
	import IconButton from '@smui/icon-button';
	import { goto } from '$app/navigation';
	import type { Favorite } from '$lib/domain/Favorite';

	export let i: number;
	export let post: Favorite;
	export let onDelete: (index: number, post: Favorite) => Promise<void>;
	let doingDelete = false;

	const goDetailPage = () => {
		goto(`/posts/${post.postId}`);
	};

	const onDeleteClicked = () => {
		doingDelete = true;
		onDelete(i, post).finally(() => {
			doingDelete = false;
		});
	};
</script>

<div class="card" use:Ripple={{ surface: true }}>
	<div class="card-content" on:click={goDetailPage}>
		<div>
			<h3 class="post-title">
				{post.title}
			</h3>
			<p class="post-author">{post.author}</p>
		</div>
		<div style="display: flex; align-items: center;" on:click|stopPropagation={onDeleteClicked}>
			<IconButton class="material-icons">
				{#if doingDelete}
					more_horiz
				{:else}
					favorite
				{/if}
			</IconButton>
		</div>
	</div>
</div>

<style>
	.card {
		padding: 20px;
		box-shadow: 2px 3px 7px 0px rgba(0, 0, 0, 0.3);
		border-radius: 8px;
		cursor: pointer;
	}
	.card-content {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.post-title {
		display: flex;
		align-items: center;
		font-weight: 600;
		font-size: 1.4rem;
	}

	.post-author {
		color: #7c7c7c;
		font-size: 1rem;
	}
</style>
