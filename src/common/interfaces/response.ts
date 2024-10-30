export type IResponseData<T = any> = {
  code?: number;
  message?: string;
  data: T;
};

export type PaginatedResult<T = any> = {
  rows: T[];
  total: number;
  page: number;
};
