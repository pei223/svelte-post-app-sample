<script lang="ts">
	import Ripple from '@smui/ripple';
	import type { MyPost, Post } from '../../domain/post';
	import IconButton, { Icon } from '@smui/icon-button';
	import { goto } from '$app/navigation';

	export let i: number;
	export let post: MyPost;
	export let onDeleteClicked: (index: number, post: MyPost) => void;

	const goDetailPage = () => {
		goto(`/posts/${post.id}`);
	};
</script>

<div class="card" use:Ripple={{ surface: true }}>
	<div class="card-content" on:click={goDetailPage}>
		<div>
			<h3 class="post-title">
				{#if !post.expose}
					<Icon class="material-icons">lock</Icon>
				{/if}
				{post.title}
			</h3>
			<p class="post-author">{post.author.name}</p>
			<p class="post-created-at">{post.createdAt}</p>
		</div>
		<div
			style="display: flex; align-items: center;"
			on:click|stopPropagation={() => onDeleteClicked(i, post)}
		>
			<IconButton class="material-icons">delete</IconButton>
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

	.post-created-at {
		color: #7c7c7c;
		font-size: 0.8rem;
	}
	.grid {
		display: flex;
		align-content: center;
	}
</style>
