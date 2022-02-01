import type { User } from '../domain/UserInfo';
import UniversalCookie from 'universal-cookie';

const AUTH_TOKEN_KEY = 'AUTH_TOKEN';
const USER_INFO_KEY = 'USER_INFO';

export default class CookieService {
	private cookieWrapper: UniversalCookie;
	constructor(cookieStr?: string) {
		this.cookieWrapper = new UniversalCookie(cookieStr);
	}

	getAuthToken(): string {
		return this.cookieWrapper.get(AUTH_TOKEN_KEY) || '';
	}

	setAuthToken(token: string) {
		this.cookieWrapper.set(AUTH_TOKEN_KEY, token, { path: '/' });
	}

	deleteAuthToken() {
		this.cookieWrapper.set(AUTH_TOKEN_KEY, '', { path: '/' });
	}

	getUserInfo(): User | null {
		const userInfoSerial: string = this.cookieWrapper.get(USER_INFO_KEY);
		if (!userInfoSerial || userInfoSerial === '') {
			return null;
		}
		const fields = userInfoSerial.split('/');
		const id = fields[0] ? Number(fields[0]) : null;
		const name = fields[1] || null;
		const email = fields[2] || null;
		if (id === null || name === null || email === null || isNaN(id)) {
			return null;
		}
		return {
			id,
			name,
			email
		};
	}

	setUserInfo(user: User) {
		const userInfoserial = `${user.id}/${user.name}/${user.email}`;
		this.cookieWrapper.set(USER_INFO_KEY, userInfoserial, { path: '/' });
	}

	deleteUserInfo() {
		this.cookieWrapper.set(USER_INFO_KEY, '', { path: '/' });
	}
}
