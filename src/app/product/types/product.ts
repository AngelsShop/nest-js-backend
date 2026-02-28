import { Size } from 'src/constants/size';
import { PageDataRequest } from 'src/types/PageData';

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  size: Size;
};

export type CreateProduct = Omit<Product, 'id'>;

export type ListProductsRequest = {
  filter: ListProductsFilter;
  pageData: PageDataRequest;
};

export type ListProductsFilter = {
  categoryId?: string;
  size?: Size;
};
