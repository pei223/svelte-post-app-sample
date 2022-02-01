import type { MyPost, MyPostList, PostList } from '../domain/post';
import { baseApi } from './baseApi';

export type PostBody = {
	title: string;
	content: string;
	expose: boolean;
};

export const getMyPosts = async (accessToken: string, page: number): Promise<MyPostList> => {
	const result = await baseApi.get<MyPostList>(`/posts/me?page=${page}`, {
		headers: {
			Authorization: `Bearer ${accessToken}`
		}
	});
	return result.data;
};

export const getPosts = async (accessToken: string, page: number): Promise<PostList> => {
	const result = await baseApi.get<PostList>(`/posts/?page=${page}`, {
		headers: {
			Authorization: `Bearer ${accessToken}`
		}
	});
	return result.data;
};

export const registerPost = async (accessToken: string, postBody: PostBody): Promise<void> => {
	await baseApi.post(`/posts/`, postBody, {
		headers: {
			Authorization: `Bearer ${accessToken}`
		}
	});
};

export const updatePost = async (
	accessToken: string,
	postId: number,
	postBody: PostBody
): Promise<void> => {
	await baseApi.put(`/posts/${postId}`, postBody, {
		headers: {
			Authorization: `Bearer ${accessToken}`
		}
	});
};

export const findPost = async (accessToken: string | null, postId: number): Promise<MyPost> => {
	if (accessToken !== '' && accessToken !== null) {
		const res = await baseApi.get<MyPost>(`/posts/${postId}`, {
			headers: {
				Authorization: `Bearer ${accessToken}`
			}
		});
		return res.data;
	} else {
		const res = await baseApi.get<MyPost>(`/posts/${postId}`);
		return res.data;
	}
};

export const deletePost = async (accessToken: string | null, postId: number): Promise<void> => {
	await baseApi.delete(`/posts/${postId}`, {
		headers: {
			Authorization: `Bearer ${accessToken}`
		}
	});
};
