import type { User } from '$lib/domain/UserInfo';
import type CookieService from '$lib/services/CookieService';
import type { Writable } from 'svelte/store';

export type AppStoreType = {
	accessToken: string;
	currentUser: User | null;
};

// export const INITIAL_APP_STORE = writable<AppStoreType>({
// 	accessToken: '',
// 	currentUser: null
// });

export class AppStoreWrapper {
	readonly appStore: Writable<AppStoreType>;
	readonly cookieService: CookieService;

	constructor(appStore, cookieService) {
		this.appStore = appStore;
		this.cookieService = cookieService;
	}

	set(token: string, user: User) {
		this.appStore.set({
			accessToken: token,
			currentUser: user
		});
		this.cookieService.setAuthToken(token);
		this.cookieService.setUserInfo(user);
	}

	clear() {
		this.appStore.set({
			accessToken: '',
			currentUser: null
		});
		this.cookieService.deleteAuthToken();
		this.cookieService.deleteUserInfo();
	}
}
