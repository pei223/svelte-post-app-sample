<script lang="ts">
	import Ripple from '@smui/ripple';
	import type { Post } from '../../domain/post';
	import IconButton, { Icon } from '@smui/icon-button';
	import { goto } from '$app/navigation';

	export let i: number;
	export let post: Post;
	export let onFavoriteChanged: (index: number, post: Post) => Promise<void>;
	let favoriteLoading = false;

	const goDetailPage = () => {
		goto(`/posts/${post.id}`);
	};
	const onFavoriteChangeClicked = () => {
		favoriteLoading = true;
		onFavoriteChanged(i, post).finally(() => {
			favoriteLoading = false;
		});
	};
</script>

<div class="card" use:Ripple={{ surface: true }}>
	<div class="card-content" on:click={goDetailPage}>
		<div>
			<h3 class="post-title">{post.title}</h3>
			<p class="post-author">{post.author.name}</p>
			<p class="post-created-at">{post.createdAt}</p>
		</div>
		<div
			style="display: flex; align-items: center;"
			on:click|stopPropagation={onFavoriteChangeClicked}
		>
			<IconButton class="material-icons">
				{#if favoriteLoading}
					more_horiz
				{:else if post.favorited}
					favorite
				{:else}
					favorite_border
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
		font-weight: 600;
		font-size: 1.4rem;
	}

	.post-author {
		color: #7c7c7c;
		font-size: 1rem;
	}

	.post-created-at {
		color: #7c7c7c;
		font-size: 0.8rem;
	}
</style>
