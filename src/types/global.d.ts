import { DataSourceOptions } from "typeorm";

export { };

declare global {
    interface IconfigService {
        COOKIE_KEY?: string;
        DB_NAME?: string;
        JWT_ACCESS_SECRET?: string;
        JWT_REFRESH_SECRET?: string;
        JWT_STREAM_SECRET?: string;
        OAUTH_GOOGLE_ID?: string;
        OAUTH_GOOGLE_SECRET?: string;
        OAUTH_GOOGLE_REDIRECT_URL?: string;
        RUNNING_MECHINE_URL?: string;
        CLIENT_PORT?: number;
        SERVER_PORT?: number;
        NMS_HTTP_PORT?: number;
        NMS_RTMP_PORT?: number;
        JWT_ACCESS_EXPIRATION_TIME?: string | number;
        JWT_REFRESH_EXPIRATION_TIME?: string | number;
        JWT_STREAM_EXPIRATION_TIME?: string | number;
    }

    interface IDBConfig {
        development: DataSourceOptions;
        test?: DataSourceOptions;
        production?: DataSourceOptions;
    }
}