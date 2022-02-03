import axios from 'axios';

export const ERROR_CODE = {
	networkError: 1,
	unexpectedApiError: 2,
	notFound: 3,
	paramError: 4,
	notAxiosError: 999,
	axiosError: 1000
} as const;

export type ErrorCode = typeof ERROR_CODE[keyof typeof ERROR_CODE];

export const genErrorPath = (path: string, errorCode: ErrorCode) => {
	return `/error?id=${path}-${errorCode}`;
};

export class ErrorInfo {
	readonly from: string;
	readonly code: ErrorCode;
	readonly status: number;

	constructor(from: string, code: ErrorCode, status: number) {
		this.from = from;
		this.code = code;
		this.status = status;
	}

	isHttpError(): boolean {
		return this.status !== -1;
	}

	static fromError(error: Error, from: string) {
		if (!axios.isAxiosError(error)) {
			return new ErrorInfo(from, ERROR_CODE.notAxiosError, -1);
		}
		if (!error.response) {
			return new ErrorInfo(from, ERROR_CODE.networkError, -1);
		}
		return new ErrorInfo(from, ERROR_CODE.axiosError, error.response.status);
	}
}
