<script lang="ts">
	import { page } from '$app/stores';
	import logo from './svelte-logo.svg';
	import IconButton from '@smui/icon-button';
	import TopAppBar, { Title, Row, Section } from '@smui/top-app-bar';
	import Drawer, { AppContent, Content, Header, Subtitle, Scrim } from '@smui/drawer';
	import List, { Item, Text, Graphic, Separator, Subheader } from '@smui/list';
	import { goto } from '$app/navigation';
	let open = false;
	const menus = [
		{
			url: '/posts/',
			icon: 'star',
			text: '記事一覧'
		},
		{
			url: '/posts/me',
			icon: 'star',
			text: '自分の記事一覧'
		}
	];

	const goPage = (url: string) => {
		open = false;
		goto(url);
	};
</script>

<Drawer variant="modal" fixed={false} bind:open>
	<Content>
		<List>
			{#each menus as menu}
				<Item on:click={() => goPage(menu.url)}>
					<Graphic class="material-icons" aria-hidden="true">
						{menu.icon}
					</Graphic>
					<Text>
						{menu.text}
					</Text>
				</Item>
			{/each}
		</List>
	</Content>
</Drawer>
<Scrim fixed={false} />

<TopAppBar variant="static" color="primary" dense={false} prominent={false}>
	<Row>
		<Section>
			<IconButton class="material-icons" on:click={() => (open = true)}>menu</IconButton>
			<Title>Post-app</Title>
		</Section>
	</Row>
</TopAppBar>
