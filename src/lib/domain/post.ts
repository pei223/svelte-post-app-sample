import { DEFAULT_DATE_STR } from './common';
import type { User } from './UserInfo';

export type Author = User & {
	updatedAt: string;
	createdAt: string;
};

export type MyPost = {
	id: number;
	title: string;
	content: string;
	expose: boolean;
	createdAt: string;
	updatedAt: string;
	author: Author;
};

export type MyPostList = {
	posts: MyPost[];
	totalPage: number;
};

export type Post = MyPost & {
	favorited: boolean;
};

export type PostList = {
	posts: Post[];
	totalPage: number;
};

export const DEFAULT_AUTHOR: Author = {
	id: -1,
	name: '',
	email: '',
	createdAt: DEFAULT_DATE_STR,
	updatedAt: DEFAULT_DATE_STR
};

export const DEFAULT_POST: MyPost = {
	id: -1,
	title: '',
	content: '',
	expose: false,
	createdAt: DEFAULT_DATE_STR,
	updatedAt: DEFAULT_DATE_STR,
	author: DEFAULT_AUTHOR
};
