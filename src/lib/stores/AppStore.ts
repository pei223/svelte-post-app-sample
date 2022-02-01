import type { User } from '$lib/domain/UserInfo';
import type CookieService from '$lib/services/CookieService';
import { writable } from 'svelte/store';

export type AppStoreType = {
	accessToken: string;
	currentUser: User | null;
};

export const INITIAL_APP_STORE = writable<AppStoreType>({
	accessToken: '',
	currentUser: null
});

export class AppStoreWrapper {
	readonly appStore: AppStoreType;
	readonly cookieService: CookieService;

	constructor(appStore, cookieService) {
		this.appStore = appStore;
		this.cookieService = cookieService;
	}

	setToken(token: string) {
		this.appStore.accessToken = token;
		this.cookieService.setAuthToken(token);
	}

	setUser(user: User) {
		this.appStore.currentUser = user;
		this.cookieService.setUserInfo(user);
	}
}
