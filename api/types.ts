/**
 * Generic API Request/Response Types
 */

export interface ApiResponseSuccess<T> {
  success: true;
  data: T;
}

export interface ApiResponseException {
  message: string;
  status?: number;
  success: false;
}

export enum ApiResponseGrpcStatusDetailType {
  ERROR_INFO = "type.googleapis.com/google.rpc.ErrorInfo",
  REQUEST_INFO = "type.googleapis.com/google.rpc.RequestInfo",
}

export interface ApiResponseGrpcStatusDetailError {
  "@type": ApiResponseGrpcStatusDetailType;
  domain: string;
  metadata: any;
  reason: string;
}

export interface ApiResponseGrpcStatusDetailRequest {
  "@type": ApiResponseGrpcStatusDetailType;
  requestId: string;
  servingData: string;
}

export type ApiResponseGrpcStatusDetail =
  | ApiResponseGrpcStatusDetailError
  | ApiResponseGrpcStatusDetailRequest;

export interface ApiResponseGrpcStatus extends ApiResponseException {
  code: string;
  details: ApiResponseGrpcStatusDetail[];
  message: string;
}

/**
 * An API error response which can be a generic exception or a GRPC status
 */
export type ApiResponseError = ApiResponseException | ApiResponseGrpcStatus;

/**
 * Usage:
 *   - ApiResponse<T>: A basic API response, returning data of type T or an ApiResponseError
 *   - ApiResponse<T, ApiResponseProblem>: An enhanced API response, returning data of type T,
 *   an ApiResponseProblem with enhanced error info, or a basic ApiResponseError if something
 *   went very wrong with the request.
 */
export type ApiResponse<T, U = ApiResponseError> =
  | ApiResponseSuccess<T>
  | ApiResponseError
  | U;

export interface FetchedData<T> {
  isLoading: boolean;
  error: ApiResponseError | null;
  data: T | null;
}

export interface ApiResponseFilter {
  nextPageToken?: string;
  previousPageToken?: string;
  total: number;
}

export interface ApiPaginationFilter {
  pageToken?: string;
  pageSize?: number;
}
