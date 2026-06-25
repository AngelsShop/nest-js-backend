import { Size } from 'src/constants/size';
import { PageDataRequest } from 'src/types/PageData';
import { ProductListItemEntity } from './entities/product-list-item.entity';

export type ListProductsRequest = {
  filter: ListProductsFilter;
  pageData: PageDataRequest;
  userId?: string;
};

export type ListProductsFilter = {
  categoryId?: string;
  size?: Size;
};

export type ProductAttributes = {
  sizes: Set<ProductListItemEntity['size']>;
  colors: Set<ProductListItemEntity['color']>;
};
