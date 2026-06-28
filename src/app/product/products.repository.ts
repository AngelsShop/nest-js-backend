import { Injectable } from '@nestjs/common';
import { DbService } from 'src/common/service/db/db.service';
import {
  ListProductsFilter,
  ListProductsRequest,
  ProductAttributes,
} from './types';
import { PageDataRequest } from 'src/types/PageData';
import { ProductEntity, ProductEntitySchema } from './entities/product.entity';
import {
  ProductListItemEntity,
  ProductListItemEntitySchema,
  ProductListItemEntityShort,
  ProductListItemShortSchema,
} from './entities/product-list-item.entity';
import { TableNames } from 'src/constants/tables';
import { string } from 'yup';
import {
  ProductVariantEntity,
  ProductVariantEntitySchema,
} from './entities/product-variant.entity';
import { Size } from 'src/constants/size';

@Injectable()
export class ProductsRepository {
  constructor(private readonly dbService: DbService) {}

  private getProductsFilterQuery(filter: ListProductsFilter) {
    const filters: string[] = ['1=1'];
    const params: unknown[] = [];

    const fieldsFilters: Partial<
      Record<
        keyof ListProductsFilter,
        string | ((paramCount: number) => string)
      >
    > = {
      size: (paramCount) =>
        `${TableNames.PRODUCT_VARIANTS}.size = $${paramCount}`,
      categoryId: (paramCount) =>
        `${TableNames.PRODUCTS}.category_id = $${paramCount}`,
    };

    for (const key in filter) {
      if (!(key in fieldsFilters)) {
        continue;
      }

      const filterQuery = fieldsFilters[key as keyof typeof fieldsFilters];

      if (filter[key] === undefined || filterQuery === undefined) {
        continue;
      }

      if (typeof filterQuery === 'function') {
        params.push(filter[key]);
      }

      filters.push(
        typeof filterQuery === 'function'
          ? filterQuery(params.length)
          : filterQuery,
      );
    }

    if (filter.isFavorite !== undefined) {
      if (filter.isFavorite) {
        filters.push(
          `${TableNames.USER_FAVORITE_PRODUCTS}.product_variant_id IS NOT NULL`,
        );
      } else {
        filters.push(
          `${TableNames.USER_FAVORITE_PRODUCTS}.product_variant_id IS NULL`,
        );
      }
    }

    return {
      filters: filters.join(' AND '),
      params,
    };
  }

  private getListProductsQuery(filters: string, paramsLength: number) {
    return `
      SELECT
        ${TableNames.PRODUCTS}.id,
        CASE
          WHEN ${TableNames.USER_FAVORITE_PRODUCTS}.product_variant_id IS NOT NULL THEN true
          ELSE false
        END as "isFavorite"
      FROM ${TableNames.PRODUCTS}
      JOIN ${TableNames.PRODUCT_VARIANTS}
          ON (
            ${TableNames.PRODUCT_VARIANTS}.product_id = ${TableNames.PRODUCTS}.id
            AND ${TableNames.PRODUCT_VARIANTS}.is_default = true
          )
      LEFT JOIN ${TableNames.USER_FAVORITE_PRODUCTS}
        ON (
          ${TableNames.USER_FAVORITE_PRODUCTS}.user_id = $${paramsLength + 1}
          AND ${TableNames.PRODUCT_VARIANTS}.id = ${TableNames.USER_FAVORITE_PRODUCTS}.product_variant_id
        )
      WHERE ${filters}
    `;
  }

  private getPagination({ page, limit }: PageDataRequest) {
    return `LIMIT ${limit} OFFSET ${limit * (page - 1)}`;
  }

  private async getPageCardIds({
    filter,
    pageData,
    userId,
  }: ListProductsRequest): Promise<string[]> {
    const { filters, params } = this.getProductsFilterQuery(filter);

    const result = await this.dbService.query<{ id: string }>(
      `
      ${this.getListProductsQuery(filters, params.length)}
      ${this.getPagination(pageData)}
    `,
      [...params, userId],
    );

    return (result?.rows ?? []).map(({ id }) =>
      string().uuid().required().validateSync(id),
    );
  }

  async list({
    filter,
    pageData,
    userId,
  }: ListProductsRequest): Promise<ProductListItemEntity[]> {
    const cardIds = await this.getPageCardIds({ filter, pageData, userId });

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
          ${TableNames.PRODUCT_VARIANTS}.price,
          CASE
            WHEN ${TableNames.USER_FAVORITE_PRODUCTS}.product_variant_id IS NOT NULL THEN true
            ELSE false
          END as "isFavorite"
        FROM ${TableNames.PRODUCTS}
        JOIN ${TableNames.PRODUCT_VARIANTS}
          ON ${TableNames.PRODUCT_VARIANTS}.product_id = ${TableNames.PRODUCTS}.id
        LEFT JOIN ${TableNames.USER_FAVORITE_PRODUCTS}
          ON (
            ${TableNames.USER_FAVORITE_PRODUCTS}.user_id = $2
            AND ${TableNames.PRODUCT_VARIANTS}.id = ${TableNames.USER_FAVORITE_PRODUCTS}.product_variant_id
          )
        WHERE
          ${TableNames.PRODUCTS}.id = ANY($1)
        ORDER BY created_at DESC
      `,
      [cardIds, userId],
    );

    const listItems: ProductListItemEntityShort[] = (result?.rows ?? []).map(
      (v) => ProductListItemShortSchema.validateSync(v),
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
      .filter(({ isDefault }) => Boolean(isDefault))
      .reduce<ProductListItemEntity[]>((arr, item) => {
        arr.push({
          ...item,
          sizes: [...(attributesMap[item.productId]?.sizes ?? [])],
          colors: [...(attributesMap[item.productId]?.colors ?? [])],
        });

        return arr;
      }, [])
      .map((r) => ProductListItemEntitySchema.validateSync(r));
  }

  async countPages({ filter, pageData, userId }: ListProductsRequest) {
    const { filters, params } = this.getProductsFilterQuery(filter);

    const result = await this.dbService.query(
      `${this.getListProductsQuery(filters, params.length)}`,
      [...params, userId],
    );

    console.log(result);

    return Math.ceil((result?.rowCount ?? 0) / pageData.limit);
  }

  async getById(
    id: string,
    userId?: string,
  ): Promise<ProductEntity | undefined> {
    const productCardResult = await this.dbService.query(
      `
        SELECT
          ${TableNames.PRODUCTS}.id,
          ${TableNames.PRODUCTS}.title,
          ${TableNames.PRODUCTS}.preview_image as "previewImage",
          ${TableNames.PRODUCTS}.created_at as "createdAt",
          ${TableNames.PRODUCTS}.category_id as "categoryId",
          ${TableNames.PRODUCT_VARIANTS}.id as "variantId",
          CASE
            WHEN ${TableNames.USER_FAVORITE_PRODUCTS}.product_variant_id IS NOT NULL THEN true
            ELSE false
          END as "isFavorite"
        FROM ${TableNames.PRODUCTS}
        JOIN ${TableNames.PRODUCT_VARIANTS}
          ON (
            ${TableNames.PRODUCT_VARIANTS}.product_id = ${TableNames.PRODUCTS}.id
            AND ${TableNames.PRODUCT_VARIANTS}.is_default = true
          )
        LEFT JOIN ${TableNames.USER_FAVORITE_PRODUCTS}
          ON (
            ${TableNames.PRODUCT_VARIANTS}.id = ${TableNames.USER_FAVORITE_PRODUCTS}.product_variant_id
            AND ${TableNames.USER_FAVORITE_PRODUCTS}.user_id = $2
          )
        WHERE
          ${TableNames.PRODUCTS}.id = $1
      `,
      [id, userId],
    );

    const productCard = (productCardResult?.rows ?? []).map((c) =>
      ProductEntitySchema.validateSync(c),
    )[0];

    if (!productCard) {
      return;
    }

    return productCard;
  }

  async getProductVariants(
    id: string,
    userId?: string,
  ): Promise<ProductVariantEntity[]> {
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
          is_default as "isDefault",
          CASE
            WHEN ${TableNames.USER_FAVORITE_PRODUCTS}.product_variant_id IS NOT NULL THEN true
            ELSE false
          END as "isFavorite"
        FROM ${TableNames.PRODUCT_VARIANTS}
        LEFT JOIN ${TableNames.USER_FAVORITE_PRODUCTS}
          ON (
            id = ${TableNames.USER_FAVORITE_PRODUCTS}.product_variant_id
            AND ${TableNames.USER_FAVORITE_PRODUCTS}.user_id = $2
          )
        WHERE
          product_id = $1
      `,
      [id, userId],
    );

    const variants = (productVariantsResult?.rows ?? []).map((v) =>
      ProductVariantEntitySchema.validateSync(v),
    );

    return variants;
  }

  async getProductVariantById(
    id: string,
  ): Promise<ProductVariantEntity | undefined> {
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
      ProductVariantEntitySchema.validateSync(v),
    );

    return variants[0];
  }

  async addProductVariantToFavorites(
    variant: ProductVariantEntity,
    userId: string,
  ) {
    await this.dbService.query(
      `
      INSERT INTO ${TableNames.USER_FAVORITE_PRODUCTS}
      (user_id, product_variant_id)
      VALUES ($1, $2)
    `,
      [userId, variant.id],
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
