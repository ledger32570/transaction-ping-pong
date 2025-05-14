import axios from "axios";
import { getAccessToken } from ".";
import { API_CLIENT_ID, API_CLIENT_SECRET } from "../config";

declare module "axios" {
  export interface AxiosRequestConfig {
    byPassAuthorization?: boolean;
  }
}

export const initInterceptor = () => {
  axios.interceptors.request.use(async (config: any) => {
    console.log("Request intercepted", config.url);
    if (config.byPassAuthorization) {
      return {
        ...config,
        headers: { ...config.headers, Authorization: undefined },
      };
    }

    if (!config.headers?.Authorization) {
      const response = await getAccessToken(
        API_CLIENT_ID as string,
        API_CLIENT_SECRET as string
      );

      if (response.success) {
        return {
          ...config,
          headers: {
            ...config.headers,
            Authorization: `Bearer ${response.data.accessToken}`,
          },
        };
      }
    }

    return config;
  });
};
