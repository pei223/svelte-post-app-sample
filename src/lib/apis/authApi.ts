import { baseApi } from './baseApi';
import type { User } from '../domain/UserInfo';

export type LoginBody = {
	name: string;
	password: string;
};

export type LoginRes = User & {
	token: string;
};

export type SignupBody = {
	name: string;
	password: string;
	email: string;
};

export const loginRequest = async (body: LoginBody): Promise<LoginRes> => {
	const result = await baseApi.post<LoginRes>('/auth/login', body);
	return result.data;
};

export const signupRequest = async (body: SignupBody): Promise<LoginRes> => {
	const result = await baseApi.post<LoginRes>(`/auth/signup`, body);
	return result.data;
};
