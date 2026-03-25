import { Size } from 'src/constants/size';
import { PageDataRequest } from 'src/types/PageData';

export type ListProductsRequest = {
  filter: ListProductsFilter;
  pageData: PageDataRequest;
};

export type ListProductsFilter = {
  categoryId?: string;
  size?: Size;
};
