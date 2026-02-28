import { Size } from 'src/constants/size';
import { PageDataRequest } from 'src/types/PageData';
import { Product } from './entities/product.entity';

export type CreateProduct = Omit<Product, 'id'>;

export type ListProductsRequest = {
  filter: ListProductsFilter;
  pageData: PageDataRequest;
};

export type ListProductsFilter = {
  categoryId?: string;
  size?: Size;
};
