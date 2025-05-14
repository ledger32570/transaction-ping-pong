import axios, { AxiosError } from "axios";
import {
  FLARE_MULTISIGN_BACKEND_API_URI,
  PALISADE_API_GATEWAY_URI,
} from "../config";
import {
  ApiResponseError,
  ApiResponseException,
  ApiResponseGrpcStatus,
  ApiResponseGrpcStatusDetail,
  ApiResponseGrpcStatusDetailError,
  ApiResponseSuccess,
  FetchedData,
} from "./types";

type RequestMethods = "POST" | "GET" | "PATCH" | "DELETE" | "PUT";

/**
 * Create an ApiResponseSuccess object from the given data returned by a successful
 * response.
 *
 * We take the data object directly here vs. the full response object because
 * the response "data" is not always the full response body, and can sometimes be something
 * custom like a single property on the response.
 */
export function createApiResponseSuccess<T>(data: T): ApiResponseSuccess<T> {
  return { success: true, data };
}

/**
 * Handle any thrown axios error. This is our most general error format, that can
 * handle terrible things like no request being made or response coming back.
 */
export function handleApiResponseError(error: AxiosError): ApiResponseError {
  // Check that this error returned any response data
  if (!error.response || !error.response.data) {
    return createApiResponseException(error);
  }
  // Basic check that this error response data is of type "Problem"
  const { data } = error.response as any;

  if (!data) {
    return createApiResponseException(error);
  }

  const grpcStatusResponse: ApiResponseGrpcStatus = {
    ...data,
    ...{
      description: error.message,
      status: Number(error.response.status),
      success: false,
    },
  };

  return grpcStatusResponse;
}

/**
 * Handle any thrown axios error. This is our most general error format, that can
 * handle terrible things like no request being made or response coming back.
 */
export function createApiResponseException(
  error: AxiosError
): ApiResponseException {
  return {
    success: false,
    status: error.response && error.response.status,
    message: error.message,
  };
}

export const createFetchedData = (
  withProps?: Partial<FetchedData<any>>
): FetchedData<any> => {
  return {
    data: null,
    error: null,
    isLoading: false,
    ...withProps,
  };
};

export function isFetchedDataListLoading(
  fetchedDataList: Array<FetchedData<any>>
): boolean {
  return fetchedDataList.some((fetchedData) => fetchedData.isLoading);
}

export function hasFetchedDataListError(
  fetchedDataList: Array<FetchedData<any>>
): boolean {
  return fetchedDataList.some((fetchedData) => isFetchedDataError(fetchedData));
}

export function isFetchedDataError(fetchedData: FetchedData<any>): boolean {
  return !!fetchedData.error || !fetchedData.data;
}

export function makeApiGatewayRequest(
  method: RequestMethods,
  path: string,
  data?: any
) {
  return axios({
    method,
    url: `${PALISADE_API_GATEWAY_URI}${path}`,
    data,
    byPassAuthorization: false,
  })
    .then((response) => createApiResponseSuccess(response.data))
    .catch(handleApiResponseError);
}

export function makeUnauthenticatedApiGatewayRequest(
  method: RequestMethods,
  path: string,
  data?: any
) {
  return axios({
    method,
    url: `${PALISADE_API_GATEWAY_URI}${path}`,
    data,
    byPassAuthorization: true,
  })
    .then((response) => createApiResponseSuccess(response.data))
    .catch(handleApiResponseError);
}

export function makeFlareApiRequest(
  method: RequestMethods,
  path: string,
  data?: any
) {
  return axios({
    method,
    url: `${FLARE_MULTISIGN_BACKEND_API_URI}${path}`,
    data,
    byPassAuthorization: true,
  })
    .then((response) => createApiResponseSuccess(response.data))
    .catch(handleApiResponseError);
}

/**
 * A specific GRPC status response for v2 of the API: https://cloud.google.com/apis/design/errors
 */
export function isApiResponseGrpcStatus(
  response: ApiResponseError
): response is ApiResponseGrpcStatus {
  return "details" in response;
}

export function isGrpcStatusDetailError(
  statusDetail: ApiResponseGrpcStatusDetail
): statusDetail is ApiResponseGrpcStatusDetailError {
  return "reason" in statusDetail;
}

export function getGrpcStatusDetailErrorInfo(
  errorResponse: ApiResponseGrpcStatus
): ApiResponseGrpcStatusDetailError | undefined {
  return errorResponse.details.find((detail) =>
    isGrpcStatusDetailError(detail)
  ) as ApiResponseGrpcStatusDetailError;
}
