export type PageDataRequest = {
  page: number;
  limit: number;
};

export type PageDataResponse = {
  page: number;
  limit: number;
  totalPages: number;
};
