import HttpService from "./httpService";


interface LoginResponse {
  success: boolean;
  message: string;
  token?: string;
  user: {
    id: string;
    phoneNumber: string;
    name?: string;
  };
  settings?: {
    language: string;
    dateFormat: string;
    pageLimit: number;
  };
}

class AuthService {
  static async login(phoneNumber: string): Promise<LoginResponse> {
    // eslint-disable-next-line no-useless-catch
    try {
      const response = await HttpService.post<LoginResponse>(
        '/auth/send-otp',
        { phone:'+91'+phoneNumber },
        {},
        { isAccessTokenRequire: false }
      );

      if (response.token) {
        localStorage.setItem('token', response.token);
        this.setAuthData(response);
      }

      return response;
    } catch (error) {
      throw error;
    }
  }

  static async verifyOTP(phoneNumber: string, otp: string): Promise<LoginResponse> {
    // eslint-disable-next-line no-useless-catch
    try {
      const response = await HttpService.post<LoginResponse>(
        '/auth/verify-otp',
        { phone:'+91'+phoneNumber, code:otp },
        {},
        { isAccessTokenRequire: false }
      );

      if (response.token) {
        localStorage.setItem('token', response.token);
        this.setAuthData(response);
      }

      return response;
    } catch (error) {
      throw error;
    }
  }

  static setAuthData(data: LoginResponse) {
    localStorage.setItem('user', JSON.stringify(data.user));
    if (data.settings) {
      localStorage.setItem('settings', JSON.stringify(data.settings));
    }
  }

  static getAuthData() {
    const user = localStorage.getItem('user');
    const settings = localStorage.getItem('settings');
    return {
      user: user ? JSON.parse(user) : null,
      settings: settings ? JSON.parse(settings) : null,
    };
  }

  static getAccessToken(): string | null {
    return localStorage.getItem('token');
  }

  static isAuthenticated(): boolean {
    return !!this.getAccessToken();
  }

  static logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('settings');
  }
}

export default AuthService; 