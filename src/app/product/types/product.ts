export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
};

export type CreateProduct = Omit<Product, 'id'>;

export type ListProductsFilter = {
  page: number;
  limit: number;
  categoryId?: string;
};
