import CryptoJS from 'crypto-js';
import { IAnalyticsStore, IMatfoxxConfig, LoginResponse, UserProfileResponse } from 'features/login/interface/login';
const KEY = 'adsfghjkla2312safaaszAS';

/**
 * function to check if user is logged in or not
 */
const checkLogin = (): boolean => {
	if (localStorage.authData) {
		return true;
	} else {
		return false;
	}
};

/**
 * function to get user access token
 */
const getAccessToken = (): boolean | string => {
	try {
		const data = localStorage.authData;
		if (data) {
			const bytes = CryptoJS.AES.decrypt(data.toString(), KEY);
			const decryptedData: LoginResponse = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
			return decryptedData && decryptedData.token ? decryptedData.token : false;
		} else {
			return false;
		}
	} catch (e) {
		return false;
	}
};

/**
 * function to get user data
 */
const getUserData = (): LoginResponse => {
	const data = localStorage.authData;
	if (data) {
		const bytes = CryptoJS.AES.decrypt(data.toString(), KEY);
		const decryptedData: LoginResponse = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
		if (!decryptedData) {
			return {} as LoginResponse;
		}
		return decryptedData;
	} else {
		return {} as LoginResponse;
	}
};

const getUserLanguage = (): string => {
	const userLang = localStorage.getItem('lang') || navigator.language;
	if (userLang.includes('de')) {
		return 'de';
	}
	return 'en';
};

const setAuthData = (data: LoginResponse): void => {
	const cipherText = CryptoJS.AES.encrypt(JSON.stringify(data), KEY);
	localStorage.setItem('authData', cipherText.toString());
};

const setMatfoxxSettings = (data: IMatfoxxConfig): void => {
	const cipherText = CryptoJS.AES.encrypt(JSON.stringify(data), KEY);
	localStorage.setItem('matfoxxConfig', cipherText.toString());
};

/**
 * function to set user authentication data
 */
const setUserData = (data: UserProfileResponse): void => {
	const cipherText = CryptoJS.AES.encrypt(JSON.stringify(data), KEY);
	localStorage.setItem('userData', cipherText.toString());
};

const setDateFormate = (formate: string): void => {
	localStorage.setItem('dateFormate', formate);
};
const getDateFormate = () => {
	const formate = localStorage.getItem('dateFormate');
	if (formate) {
		return formate;
	} else {
		return;
	}
};

/**
 * function to get user authentication data
 */
const getAuthData = (): LoginResponse | undefined => {
	const data = localStorage.authData;
	if (data) {
		const bytes = CryptoJS.AES.decrypt(data.toString(), KEY);
		const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
		return decryptedData;
	} else {
		return;
	}
};

const getMatfoxxSettings = (): IMatfoxxConfig | undefined => {
	try {
		const data = localStorage.matfoxxConfig;
		if (data) {
			const bytes = CryptoJS.AES.decrypt(data.toString(), KEY);
			const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
			return decryptedData;
		} else {
			return {} as IMatfoxxConfig;
		}
	} catch (error) {
		console.error(error);
	}
};

/**
 * function to remove user authentication data
 */
const removeAuthData = (): void => {
	localStorage.removeItem('authData');
};

const setAnalyticsSessionStore = (data: IAnalyticsStore) => {
	const cipherText = CryptoJS.AES.encrypt(JSON.stringify(data), KEY);
	localStorage.setItem('analyticsStore', cipherText.toString());
};

const getAnalyticsSessionStore = () => {
	const data = localStorage.analyticsStore;
	if (data) {
		const bytes = CryptoJS.AES.decrypt(data.toString(), KEY);
		const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
		return decryptedData;
	} else {
		return {} as IAnalyticsStore;
	}
};

const authService = {
	checkLogin: checkLogin,
	getAccessToken: getAccessToken,
	getUserData: getUserData,
	setAuthData: setAuthData,
	getAuthData: getAuthData,
	removeAuthData: removeAuthData,
	setUserData: setUserData,
	getUserLanguage: getUserLanguage,
	setDateFormate: setDateFormate,
	getDateFormate: getDateFormate,
	setMatfoxxSettings: setMatfoxxSettings,
	getMatfoxxSettings: getMatfoxxSettings,
	setAnalyticsSessionStore: setAnalyticsSessionStore,
	getAnalyticsSessionStore: getAnalyticsSessionStore
};

export default authService;
