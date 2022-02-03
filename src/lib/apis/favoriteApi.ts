import { baseApi } from './baseApi';
import type { FavoriteList } from '../domain/Favorite';

export const addFavorite = async (accessToken: string, postId: number): Promise<void> => {
	await baseApi.post(
		`/favorites/add/${postId}`,
		{},
		{
			headers: {
				Authorization: `Bearer ${accessToken}`
			}
		}
	);
};

export const deleteFavorite = async (accessToken: string, postId: number): Promise<void> => {
	await baseApi.post(
		`/favorites/delete/${postId}`,
		{},
		{
			headers: {
				Authorization: `Bearer ${accessToken}`
			}
		}
	);
};

export const getFavorites = async (accessToken: string, page: number): Promise<FavoriteList> => {
	const result = await baseApi.get<FavoriteList>(`/favorites/?page=${page}`, {
		headers: {
			Authorization: `Bearer ${accessToken}`
		}
	});
	return result.data;
};
