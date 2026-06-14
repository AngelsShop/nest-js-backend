import { Injectable } from '@nestjs/common';
import { DbService } from 'src/common/service/db/db.service';
import {
  ListProductsFilter,
  ListProductsRequest,
  ProductAttributes,
} from './types';
import { ColumnsMap } from './constants/columns';
import { PageDataRequest } from 'src/types/PageData';
import { ProductCard } from './entities/product-card.entity';
import {
  ProductListItem,
  productListItemSchema,
} from './entities/product-list-item.entity';
import { TableNames } from 'src/constants/tables';
import { string } from 'yup';
import {
  ProductListItemDto,
  productListItemDtoSchema,
} from './dto/product-list-item.dto';
import { Size } from 'src/constants/size';
import {
  ProductVariant,
  productVariantSchema,
} from './entities/product-variant.entity';
import { productCardDtoSchema } from './dto/product-card.dto';

@Injectable()
export class ProductsRepository {
  constructor(private readonly dbService: DbService) {}

  private getProductsFilterQuery(
    filter: ListProductsFilter,
    dbName?: TableNames,
  ) {
    const filters: string[] = ['1=1'];
    const params: unknown[] = [];

    for (const key in filter) {
      const dbField = ColumnsMap[key];

      if (!dbField || filter[key] === undefined) {
        continue;
      }

      params.push(filter[key]);

      filters.push(
        `${dbName ? dbName + '.' : ''}${dbField} = $${params.length}`,
      );
    }

    return {
      filters: filters.join(' AND '),
      params,
    };
  }

  private getPagination({ page, limit }: PageDataRequest) {
    return `LIMIT ${limit} OFFSET ${limit * (page - 1)}`;
  }

  private async getPageCardIds({
    filter,
    pageData,
  }: ListProductsRequest): Promise<string[]> {
    const { filters, params } = this.getProductsFilterQuery(
      filter,
      TableNames.PRODUCTS,
    );

    const result = await this.dbService.query<{ id: string }>(
      `
      SELECT id
      FROM ${TableNames.PRODUCTS}
      WHERE ${filters}
      ${this.getPagination(pageData)}
    `,
      params,
    );

    return (result?.rows ?? []).map(({ id }) =>
      string().uuid().required().validateSync(id),
    );
  }

  async list({
    filter,
    pageData,
  }: ListProductsRequest): Promise<ProductListItem[]> {
    const cardIds = await this.getPageCardIds({ filter, pageData });

    const result = await this.dbService.query(
      `
        SELECT
          ${TableNames.PRODUCTS}.id as "productId",
          ${TableNames.PRODUCTS}.title,
          ${TableNames.PRODUCTS}.preview_image as "previewImage",
          ${TableNames.PRODUCTS}.created_at as "createdAt",
          ${TableNames.PRODUCT_VARIANTS}.id as "variantId",
          ${TableNames.PRODUCT_VARIANTS}.size,
          ${TableNames.PRODUCT_VARIANTS}.color,
          ${TableNames.PRODUCT_VARIANTS}.is_default as "isDefault",
          ${TableNames.PRODUCT_VARIANTS}.price
        FROM ${TableNames.PRODUCTS}
        JOIN ${TableNames.PRODUCT_VARIANTS}
        ON ${TableNames.PRODUCT_VARIANTS}.product_id = ${TableNames.PRODUCTS}.id
        WHERE
          ${TableNames.PRODUCTS}.id = ANY($1)
        ORDER BY created_at DESC
      `,
      [cardIds],
    );

    const listItems: ProductListItemDto[] = (result?.rows ?? []).map((v) =>
      productListItemDtoSchema.validateSync(v),
    );

    const attributesMap = listItems.reduce<Record<string, ProductAttributes>>(
      (acc, item) => {
        if (!acc[item.productId]) {
          acc[item.productId] = {
            colors: new Set(),
            sizes: new Set<Size>(),
          };
        }

        acc[item.productId].colors.add(item.color);
        acc[item.productId].sizes.add(item.size);

        return acc;
      },
      {},
    );

    return listItems
      .filter(({ isDefault }) => isDefault)
      .reduce<ProductListItem[]>((arr, item) => {
        arr.push({
          ...item,
          sizes: [...(attributesMap[item.productId]?.sizes ?? [])],
          colors: [...(attributesMap[item.productId]?.colors ?? [])],
          isFavorite: false,
        });

        return arr;
      }, [])
      .map((item) => productListItemSchema.validateSync(item));
  }

  async countPages({ filter, pageData }: ListProductsRequest) {
    const { filters, params } = this.getProductsFilterQuery(filter);

    const result = await this.dbService.query(
      `SELECT * FROM ${TableNames.PRODUCTS} WHERE ${filters} ORDER BY created_at DESC`,
      params,
    );

    return Math.ceil((result?.rowCount ?? 0) / pageData.limit);
  }

  async getById(id: string): Promise<ProductCard | undefined> {
    const productCardResult = await this.dbService.query(
      `
        SELECT
          ${TableNames.PRODUCTS}.id,
          ${TableNames.PRODUCTS}.title,
          ${TableNames.PRODUCTS}.preview_image as "previewImage",
          ${TableNames.PRODUCTS}.created_at as "createdAt",
          ${TableNames.PRODUCTS}.category_id as "categoryId",
          ${TableNames.PRODUCT_VARIANTS}.id as "variantId"
        FROM ${TableNames.PRODUCTS}
        JOIN ${TableNames.PRODUCT_VARIANTS}
        ON ${TableNames.PRODUCT_VARIANTS}.product_id = ${TableNames.PRODUCTS}.id
        WHERE
          ${TableNames.PRODUCT_VARIANTS}.product_id = $1
          AND ${TableNames.PRODUCT_VARIANTS}.is_default = true
      `,
      [id],
    );

    const productCard = (productCardResult?.rows ?? []).map((c) =>
      productCardDtoSchema.validateSync(c),
    )[0];

    if (!productCard) {
      return;
    }

    const variants = await this.getProductVariants(productCard.id);
    const defaultVariant = variants.find(({ isDefault }) => isDefault);

    if (!defaultVariant) {
      return;
    }

    return {
      ...productCard,
      variant: defaultVariant,
      variants,
    };
  }

  async getProductVariants(id: string): Promise<ProductVariant[]> {
    const productVariantsResult = await this.dbService.query(
      `
        SELECT
          id,
          name,
          images,
          price,
          description,
          color,
          size,
          product_id as "productId",
          is_default as "isDefault"
        FROM ${TableNames.PRODUCT_VARIANTS}
        WHERE
          product_id = $1
      `,
      [id],
    );

    const variants = (productVariantsResult?.rows ?? []).map((v) =>
      productVariantSchema.validateSync(v),
    );

    return variants;
  }

  async getProductVariantById(id: string): Promise<ProductVariant | undefined> {
    const productVariantsResult = await this.dbService.query(
      `
        SELECT
          id,
          name,
          images,
          price,
          description,
          color,
          size,
          product_id as "productId",
          is_default as "isDefault"
        FROM ${TableNames.PRODUCT_VARIANTS}
        WHERE
          id = $1
      `,
      [id],
    );

    const variants = (productVariantsResult?.rows ?? []).map((v) =>
      productVariantSchema.validateSync(v),
    );

    return variants[0];
  }

  async addProductVariantToFavorites(variant: ProductVariant, userId: string) {
    await this.dbService.query(
      `
      INSERT INTO ${TableNames.USER_FAVORITE_PRODUCTS}
      (user_id, product_id, product_variant_id)
      VALUES ($1, $2, $3)
    `,
      [userId, variant.productId, variant.id],
    );
  }

  async removeProductVariantFromFavorites(id: string, userId: string) {
    await this.dbService.query(
      `
        DELETE FROM ${TableNames.USER_FAVORITE_PRODUCTS}
        WHERE
          product_variant_id = $1
          AND user_id = $2
      `,
      [id, userId],
    );
  }
}
