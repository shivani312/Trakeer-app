import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, Canceler, AxiosHeaders } from 'axios';
import { QueryParameters, ResponseObj } from '../interface';
import AuthService from './auth.service';
import isEmpty from 'lodash/isEmpty';
import queryString from 'query-string';

export const cancelToken = axios.CancelToken;

interface RequestData {
	[key: string]: string | number | boolean | null | undefined | object;
}

type HttpHeaders = Record<string, string>;

export interface AxiosParams extends MiscellaneousRequestParams {
	method: string;
	url: string;
	data?: RequestData;
}

export interface MiscellaneousRequestParams {
	isAccessTokenRequire?: boolean;
	contentType?: string;
	responseType?: string;
	xApi?: number | string | null;
	noCache?: boolean;
	streamUserId?: string | null;
	apiKey?: string | null;
	executor?: (cancel: Canceler) => void;
}

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

interface RequestConfig extends AxiosRequestConfig {
	isAccessTokenRequire?: boolean;
}

class HttpService {
	CancelToken = axios.CancelToken;
	cancel_req: Canceler | null = null;
	baseUrl: string;
	name: string;
	axiosInstance: AxiosInstance;

	constructor(axiosInstance: AxiosInstance, baseUrl: string, name: string) {
		this.axiosInstance = axiosInstance;
		this.baseUrl = baseUrl;
		this.name = name;
	}

	getUrl = (url: string, params: QueryParameters = {}): string => {
		if (!url.includes('https')) {
			let urlString = `${this.baseUrl}/${url}`;
			if (params && !isEmpty(params)) {
				Object.keys(params).forEach((key) => {
					if (params[key] == null || params[key] === '') {
						delete params[key];
					}
				});
				urlString += `?${queryString.stringify(params)}`;
			}
			return urlString;
		}
		return url;
	};

	/**
	 * get method
	 * @param request object containing axios params
	 */
	get = (url: string, params: QueryParameters = {}, otherData: MiscellaneousRequestParams = {}) =>
		this.commonAxios({ method: 'GET', url: this.getUrl(url, params), ...otherData });

	/**
	 * post method
	 * @param request object containing axios params
	 */
	post = (url: string, params: RequestData = {}, queryParams: QueryParameters = {}, otherData: MiscellaneousRequestParams = {}) =>
		this.commonAxios({
			method: 'POST',
			url: this.getUrl(url, queryParams),
			data: params,
			...otherData
		});

	/**
	 * put method
	 * @param request object containing axios params
	 */
	put = (url: string, params: RequestData = {}, otherData: MiscellaneousRequestParams = {}) =>
		this.commonAxios({
			method: 'PUT',
			url: this.getUrl(url),
			data: params,
			...otherData
		});

	/**
	 * deleteRequest method
	 * @param request object containing axios params
	 */
	deleteRequest = (url: string, params: RequestData = {}, otherData: MiscellaneousRequestParams = {}) =>
		this.commonAxios({
			method: 'DELETE',
			url: this.getUrl(url),
			data: params,
			...otherData
		});

	/**
	 * patch method
	 * @param request object containing axios params
	 */
	patch = (url: string, params: RequestData = {}, otherData: MiscellaneousRequestParams = {}) =>
		this.commonAxios({
			method: 'PATCH',
			url: this.getUrl(url),
			data: params,
			...otherData
		});

	/**
	 * commonAxios
	 * @param object containing method, url, data, access token, content-type
	 */
	commonAxios = ({
		method,
		url,
		data,
		isAccessTokenRequire = true,
		contentType = 'application/json',
		responseType,
		xApi = '',
		noCache = false,
		streamUserId = '',
		apiKey = '',
		executor = (c) => (this.cancel_req = c)
	}: AxiosParams): Promise<ResponseObj<unknown>> => {
		const headers: HttpHeaders = {
			'Content-Type': contentType
		};
		const token = isAccessTokenRequire && AuthService.getAccessToken();
		if (apiKey) {
			headers['api-key'] = `${apiKey}`;
		}
		if (streamUserId) {
			headers['stream-user-id'] = streamUserId;
		}
		if (xApi) {
			headers['x-api-key'] = `${xApi}`;
		}
		if (noCache) {
			headers['Cache-Control'] = 'no-cache, no-store, must-revalidate, max-age=0';
		}
		if (token) {
			headers['Authorization'] = `${token}`;
		}
		let body: string | RequestData | null = null;
		if (contentType === 'application/json' && data) {
			body = JSON.stringify(data);
		} else {
			body = data || null;
		}
		return new Promise((resolve, reject) => {
			this.axiosInstance({
				method: method,
				url: url,
				cancelToken: new axios.CancelToken(executor),
				headers: new AxiosHeaders(headers),
				responseType: responseType,
				data: body
			} as AxiosRequestConfig)
				.then((response: AxiosResponse<ResponseObj<unknown>>) => {
					if (response) {
						if (contentType === 'application/json') {
							resolve(response.data instanceof ArrayBuffer ? { data: response.data } : response.data);
						} else {
							resolve({ data: response.data });
						}
					} else {
						resolve({ data: null, message: 'Request canceled' });
					}
				})
				.catch((error: Error) => {
					reject(error);
				});
		});
	};

	getBlob = (url: string): Promise<Blob> =>
		new Promise((resolve, reject) => {
			axios
				.get(url, { responseType: 'blob' })
				.then((response: AxiosResponse<Blob>) => {
					resolve(response.data);
				})
				.catch((error: Error) => reject(error));
		});

	static async post<T>(
		url: string,
		data: RequestData,
		params: QueryParameters = {},
		config: RequestConfig = {}
	): Promise<T> {
		try {
			const headers: HttpHeaders = {
				'Content-Type': 'application/json',
			};

			if (config.isAccessTokenRequire) {
				const token = localStorage.getItem('token');
				if (token) {
					headers['Authorization'] = `Bearer ${token}`;
				}
			}

			const response = await axios.post(`${BASE_URL}${url}`, data, {
				params,
				headers: new AxiosHeaders(headers),
				...config,
			});

			return response.data;
		} catch (error) {
			if (axios.isAxiosError(error)) {
				throw error.response?.data || error.message;
			}
			throw error;
		}
	}

	static async get<T>(
		url: string,
		params: QueryParameters = {},
		config: RequestConfig = {}
	): Promise<T> {
		try {
			const headers: HttpHeaders = {
				'Content-Type': 'application/json',
			};

			if (config.isAccessTokenRequire) {
				const token = localStorage.getItem('token');
				if (token) {
					headers['Authorization'] = `Bearer ${token}`;
				}
			}

			const response = await axios.get(`${BASE_URL}${url}`, {
				params,
				headers: new AxiosHeaders(headers),
				...config,
			});

			return response.data;
		} catch (error) {
			if (axios.isAxiosError(error)) {
				throw error.response?.data || error.message;
			}
			throw error;
		}
	}
}

export default HttpService;
