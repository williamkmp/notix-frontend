import axios, { type AxiosError, type AxiosResponse, HttpStatusCode, type InternalAxiosRequestConfig } from 'axios';
import type { ServerData, ServerResponseError, ServerStandardResposne } from '~/types';

type RetryableRequest = InternalAxiosRequestConfig & {
    _isRetry: boolean;
};

export function usePublicApi() {
    const api = axios.create({
        baseURL: useRuntimeConfig().public.API_BASE_URL,
    });

    function responseOrErr(obj?: AxiosResponse): ServerStandardResposne<any> {
        if (obj && obj.data) {
            return obj.data as ServerData<any>;
        }
        else {
            const noResponseError: ServerResponseError = {
                status: HttpStatusCode.InternalServerError,
                message: 'server_no_response',
            };
            return noResponseError;
        }
    }

    api.interceptors.response.use(
        // handling response
        (response: AxiosResponse) => response.data,

        // handling response error
        (error: AxiosError<any, any>) => {
            const response = responseOrErr(error.response);
            return Promise.reject(response);
        },
    );

    return api;
}

export function usePrivateApi() {
    // Dependency
    const auth = useAuth();

    // datas
    const api = axios.create({
        baseURL: useRuntimeConfig().public.API_BASE_URL,
    });

    api.interceptors.request.use(
        // handling request
        (config: InternalAxiosRequestConfig) => {
            config.headers.Authorization = `Bearer ${auth.accessToken.value}`;
            config.headers.SessionUUID = auth.sessionId.value;
            return config;
        },

        // handling request error
        (error: AxiosError<any, any>) => {
            const response = responseOrErr(error.response);
            return Promise.reject(response);
        },
    );

    api.interceptors.response.use(
        // handling response
        (response: AxiosResponse) => {
            return response.data;
        },

        // handling response error
        async (error: AxiosError<any, any>) => {
            const response = responseOrErr(error.response);
            const originalRequest = error.config as RetryableRequest;

            // Retry unauthorized request for the first time
            if (
                response.status === HttpStatusCode.Unauthorized
                && !originalRequest._isRetry
            ) {
                originalRequest._isRetry = true;
                const isRefreshSuccess = await auth.doRefreshAuth();
                if (!isRefreshSuccess) {
                    await auth.doClearAuth();
                    return Promise.reject(response);
                }
                return api(originalRequest);
            }
            return Promise.reject(response);
        },
    );

    return api;
}

function responseOrErr(obj?: AxiosResponse): ServerStandardResposne<any> {
    if (obj && obj.data) {
        return obj.data as ServerData<any>;
    }
    else {
        const noResponseError: ServerResponseError = {
            status: HttpStatusCode.InternalServerError,
            message: 'server_no_response',
        };
        return noResponseError;
    }
}
