<script lang="ts">
	import IconButton from '@smui/icon-button';
	import TopAppBar, { Title, Row, Section } from '@smui/top-app-bar';
	import Drawer, { Content, Scrim } from '@smui/drawer';
	import List, { Item, Text, Graphic } from '@smui/list';
	import { goto } from '$app/navigation';
	import { session } from '$app/stores';
	import { AppStoreWrapper } from '$lib/stores/AppStore';
	import CookieService from '$lib/services/CookieService';
	let open = false;
	export let logined = false;
	$: menus = logined
		? [
				{
					url: '/posts/',
					icon: 'star',
					text: '記事一覧'
				},
				{
					url: '/posts/me',
					icon: 'star',
					text: '自分の記事一覧'
				},
				{
					url: '/posts/add',
					icon: 'edit',
					text: '記事を登録する'
				}
		  ]
		: [
				{
					url: '/posts/',
					icon: 'star',
					text: '記事一覧'
				},
				{
					url: '/auth/login',
					icon: 'login',
					text: 'ログイン'
				},
				{
					url: '/auth/signup',
					icon: 'star',
					text: '登録'
				}
		  ];

	const goPage = (url: string) => {
		open = false;
		goto(url);
	};
	const logout = () => {
		open = false;
		new AppStoreWrapper(session, new CookieService()).clear();
		goto('/auth/login');
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
			{#if logined}
				<div class="logout-row">
					<Item on:click={logout}>
						<Graphic class="material-icons" aria-hidden="true">logout</Graphic>
						<Text>ログアウト</Text>
					</Item>
				</div>
			{/if}
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

<style>
	.logout-row {
		margin-top: 40px;
	}
</style>
