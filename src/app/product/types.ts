import { Size } from 'src/constants/size';
import { PageDataRequest } from 'src/types/PageData';
import { ProductListItemDto } from './dto/list-item.dto';

export type ListProductsRequest = {
  filter: ListProductsFilter;
  pageData: PageDataRequest;
};

export type ListProductsFilter = {
  categoryId?: string;
  size?: Size;
};

export type ProductAttributes = {
  sizes: Set<ProductListItemDto['size']>;
  colors: Set<ProductListItemDto['color']>;
};
