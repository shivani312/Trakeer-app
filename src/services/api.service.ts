import { axiosInstance } from './http.service';
import HttpService from './httpService';

const AnalyticService = new HttpService(axiosInstance, process.env.REACT_APP_ANALYTICS_API || '', 'analytics');

export { AnalyticService };
