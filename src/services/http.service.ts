import axios, { AxiosRequestConfig, AxiosResponse, Canceler } from 'axios';
import { ResponseObj } from '../interface';
import AuthService from './auth.service';
import { getUrl } from 'shared/constants/constants';
const axiosInstance = axios.create({ timeout: 2 * 60 * 1000 });
export const cancelToken = axios.CancelToken;
let cancel_req: any;

export { cancel_req };

export interface AxiosParams extends MiscellaneousRequestParams {
	method: string;
	url: string;
	data?: any;
}

export interface MiscellaneousRequestParams {
	isAccessTokenRequire?: boolean;
	contentType?: string;
	responseType?: string;
	xApi?: number | string | null;
	noCache?: boolean;
	executor?: (cancel: Canceler) => void;
	authToken?: string;
}

/**
 * get method
 * @param request object containing axios params
 */
const get = (url: string, params: any = {}, otherData: MiscellaneousRequestParams = {}) =>
	commonAxios({ method: 'GET', url: getUrl(url, params), ...otherData });

/**
 * post method
 * @param request object containing axios params
 */
const post = (url: string, params: any = {}, queryParams = {}, otherData: MiscellaneousRequestParams = {}) =>
	commonAxios({
		method: 'POST',
		url: getUrl(url, queryParams),
		data: params,
		...otherData
	});

/**
 * put method
 * @param request object containing axios params
 */
const put = (url: string, params: any = {}, queryParams = {}, otherData: MiscellaneousRequestParams = {}) =>
	commonAxios({
		method: 'PUT',
		url: getUrl(url, queryParams),
		data: params,
		...otherData
	});

/**
 * deleteRequest method
 * @param request object containing axios params
 */
const deleteRequest = (url: string, params: any = {}, otherData: MiscellaneousRequestParams = {}) =>
	commonAxios({
		method: 'DELETE',
		url: getUrl(url),
		data: params,
		...otherData
	});

/**
 * patch method
 * @param request object containing axios params
 */
const patch = (url: string, params: any = {}, otherData: MiscellaneousRequestParams = {}) =>
	commonAxios({
		method: 'PATCH',
		url: getUrl(url),
		data: params,
		...otherData
	});

/**
 * commonAxios
 * @param object containing method, url, data, access token, content-type
 */

let currentTime = '';

const commonAxios = ({
	method,
	url,
	data,
	isAccessTokenRequire = true,
	contentType = 'application/json',
	responseType,
	xApi = '',
	noCache = false,
	authToken,
	executor = (c) => (cancel_req = c)
}: AxiosParams): Promise<any> => {
	currentTime = new Date().toISOString();
	const headers: any = {
		'Content-Type': contentType
	};
	const token = isAccessTokenRequire && AuthService.getAccessToken();
	if (xApi) {
		headers['x-api-key'] = `${xApi}`;
	}
	if (noCache) {
		headers['Cache-Control'] = 'no-cache, no-store, must-revalidate, max-age=0';
	}
	if (token) {
		headers['x-access-token'] = `${token}`;
	} else if (authToken) {
		headers['x-access-token'] = `${authToken}`;
	} else {
		// headers['x-request-language'] = localStorage.getItem('lang');
	}
	let body: any = null;
	if (contentType === 'application/json') {
		body = JSON.stringify(data);
	} else {
		body = data;
	}
	return new Promise((resolve, reject) => {
		axiosInstance({
			method: method,
			url: url,
			cancelToken: new axios.CancelToken(executor),
			headers: headers,
			responseType: responseType,
			data: body
		} as AxiosRequestConfig)
			.then((response: AxiosResponse<ResponseObj<any>>) => {
				if (response) {
					if (contentType === 'application/json') {
						resolve(response.data instanceof ArrayBuffer ? response : response.data.data);
					} else {
						resolve(response.data);
					}
				} else {
					resolve({ reqCanceled: true });
				}
			})
			.catch((error: Error) => {
				reject(error);
			});
	});
};

const getBlob = (url: string) =>
	new Promise((resolve, reject) => {
		axios
			.get(url, { responseType: 'blob' })
			.then((response: any) => {
				resolve(response.data);
			})
			.catch((error: Error) => reject(error));
	});

const httpService = {
	get: get,
	post: post,
	put: put,
	deleteRequest: deleteRequest,
	patch: patch,
	getBlob: getBlob,
	get currentTime() {
		return currentTime;
	}
};

export { axiosInstance };

export default httpService;
