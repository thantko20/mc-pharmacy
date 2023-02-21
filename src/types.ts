export type TSuccessResponse<T> = {
  statusCode: number;
  message?: string;
  payload: T;
};
