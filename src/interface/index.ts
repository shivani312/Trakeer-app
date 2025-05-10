export interface QueryParameters {
  [key: string]: string | number | boolean | null | undefined;
}

export interface ResponseObj<T> {
  data: T;
  message?: string;
  status?: number;
}

export interface ApiError {
  message: string;
  status?: number;
  errors?: Record<string, string[]>;
} 