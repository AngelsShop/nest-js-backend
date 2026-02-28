export type PageDataRequest = {
  page: number;
  limit: number;
};

export type PageDataResponse = {
  page: number;
  limit: number;
  totalPages: number;
};

export type PaginatedResponse<T> = {
  items: T[];
  pageData: PageDataResponse;
};
