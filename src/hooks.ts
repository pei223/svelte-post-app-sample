import cookie from 'cookie';
import { v4 as uuid } from '@lukeed/uuid';
import type { GetSession, Handle } from '@sveltejs/kit';
import type { AppStoreType } from '$lib/stores/AppStore';
import CookieService from '$lib/services/CookieService';

export const handle: Handle = async ({ event, resolve }) => {
	const cookies = cookie.parse(event.request.headers.get('cookie') || '');

	event.locals.userid = cookies.userid || uuid();

	const response = await resolve(event);

	if (!cookies.userid) {
		// if this is the first time the user has visited this app,
		// set a cookie so that we recognise them when they return
		response.headers.set(
			'set-cookie',
			cookie.serialize('userid', event.locals.userid, {
				path: '/',
				httpOnly: true
			})
		);
	}

	return response;
};

export const getSession: GetSession<any, any, AppStoreType> = async (event) => {
	const cookieService = new CookieService(event.request.headers.get('cookie'));
	const accessToken = cookieService.getAuthToken();
	const user = cookieService.getUserInfo();
	event.locals.accessToken = accessToken;
	return {
		currentUser: user,
		accessToken: accessToken
	};
};
