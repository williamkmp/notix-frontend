export interface ServerData<T> {
    status: number;
    message?: string;
    data: T;
}

export interface ServerResponseError {
    status: number;
    message?: string;
    error?: Record<string, string> &
    {
        '@root'?: string;
    };
}

export type ServerStandardResposne<Data> = ServerResponseError | ServerData<Data>;
