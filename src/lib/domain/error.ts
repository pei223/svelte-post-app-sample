import axios from 'axios';

export const ERROR_CODE = {
	authError: 1,
	notFound: 3,
	paramError: 4,
	networkError: 1000,
	notAxiosError: 2000,
	unexpectedApiError: 3000
} as const;
export type ErrorCode = typeof ERROR_CODE[keyof typeof ERROR_CODE];

const STATUS_ERROR_CODE_MAP = {
	400: ERROR_CODE.paramError,
	401: ERROR_CODE.authError,
	404: ERROR_CODE.notFound
};

export type ErrorMessage = {
	title: string;
	message: string;
};

export class ErrorInfo {
	readonly fromPath: string;
	readonly code: ErrorCode;
	readonly detail: string;

	constructor(path: string, code: ErrorCode, detail?: string) {
		this.fromPath = path;
		this.code = code;
		this.detail = detail ?? '';
	}

	genErrorPagePath(): string {
		if (this.code === ERROR_CODE.authError) {
			return `/auth/login?redirectUrl=${this.fromPath}`;
		}
		return `/error?param=${this.fromPath}-${this.code}-${this.detail}`;
	}

	static fromError(fromPath: string, e: Error) {
		if (!axios.isAxiosError(e)) {
			return ErrorInfo.fromErrorCode(fromPath, ERROR_CODE.notAxiosError);
		}
		if (!e.response) {
			return ErrorInfo.fromErrorCode(fromPath, ERROR_CODE.networkError);
		}
		return ErrorInfo.fromHttpStatus(fromPath, e.response.status);
	}

	static fromHttpStatus(fromPath: string, statusCode: number): ErrorInfo {
		if (STATUS_ERROR_CODE_MAP[statusCode] === undefined) {
			return new ErrorInfo(fromPath, ERROR_CODE.unexpectedApiError, statusCode.toString());
		}
		return new ErrorInfo(fromPath, STATUS_ERROR_CODE_MAP[statusCode], '');
	}

	static fromErrorCode(fromPath: string, errorCode: ErrorCode): ErrorInfo {
		return new ErrorInfo(fromPath, errorCode, '');
	}

	static parseFromErrorParam(param: string): ErrorInfo | null {
		const fields = param.split('-');
		if (fields.length !== 3) {
			return null;
		}
		return new ErrorInfo(fields[0], Number(fields[1]) as ErrorCode, fields[2]);
	}

	static isHttpError(e): boolean {
		return axios.isAxiosError(e) && e.response !== undefined;
	}

	errorMessage(): ErrorMessage {
		switch (this.code) {
			case ERROR_CODE.notFound:
				return {
					title: 'データ取得失敗',
					message: '存在しないデータです'
				};
			case ERROR_CODE.authError:
				return {
					title: '認証エラー',
					message: '再度ログインしてください'
				};
			case ERROR_CODE.paramError:
				return {
					title: 'パラメータエラー',
					message: '再度操作を実行してください'
				};
			case ERROR_CODE.networkError:
				return {
					title: 'ネットワークエラー',
					message: 'インターネット接続状況を確認してください'
				};
			default:
				return {
					title: '予期しないエラー',
					message: '予期しないエラーが発生しました'
				};
		}
	}
}
