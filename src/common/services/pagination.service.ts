import { Injectable } from '@nestjs/common';

import type { PaginationDto } from '../dtos/pagination.dto';
import type { ResponseMeta } from '../types/response-meta.type';
import type {
  BuildMetaParams,
  PaginationQueryOptions,
  PaginationQueryResult,
} from '../types/pagination.type';

@Injectable()
export class PaginationService {
  buildQuery(dto: PaginationDto, options: PaginationQueryOptions = {}): PaginationQueryResult {
    const {
      searchableColumns = [],
      defaultSortColumn = 'createdAt',
      defaultSortOrder = 'desc',
      maxLimit = 100,
      searchMode = 'insensitive',
    } = options;

    const page = this.normalizePage(dto.page);
    const limit = this.normalizeLimit(dto.limit, maxLimit);
    const search = this.normalizeSearch(dto.search);
    const requestedColumn = dto.column?.trim();
    const sortableColumns = options.sortableColumns ?? [];
    const column =
      requestedColumn && sortableColumns.includes(requestedColumn)
        ? requestedColumn
        : defaultSortColumn;
    const sort = this.normalizeSort(dto.sort, defaultSortOrder);

    const skip = (page - 1) * limit;
    const take = limit;

    const where =
      search && searchableColumns.length > 0
        ? {
            OR: searchableColumns.map((field) => ({
              [field]: this.buildSearchFilter(search, searchMode),
            })),
          }
        : undefined;

    const orderBy = {
      [column]: sort,
    };

    return {
      skip,
      take,
      where,
      orderBy,
      page,
      limit,
      search,
      column,
      sort,
    };
  }

  buildMeta(params: BuildMetaParams): ResponseMeta {
    const { dto, page, limit, totalItems, column, sort } = params;

    return {
      page,
      limit,
      totalItems,
      totalPages: totalItems > 0 ? Math.ceil(totalItems / limit) : 0,
      search: dto.search,
      column,
      sort,
    };
  }

  buildResponse<T>(params: {
    data: T[];
    dto: PaginationDto;
    totalItems: number;
    page: number;
    limit: number;
    column: string;
    sort: 'asc' | 'desc';
  }): { data: T[]; meta: ResponseMeta } {
    const { data, totalItems, dto, page, limit, column, sort } = params;

    return {
      data,
      meta: this.buildMeta({
        dto,
        page,
        limit,
        totalItems,
        column,
        sort,
      }),
    };
  }

  private normalizePage(page?: number): number {
    if (!page || Number.isNaN(page) || page < 1) return 1;
    return Math.floor(page);
  }

  private normalizeLimit(limit?: number, maxLimit = 100): number {
    if (!limit || Number.isNaN(limit) || limit < 1) return 10;
    return Math.min(Math.floor(limit), maxLimit);
  }

  private normalizeSearch(search?: string): string | undefined {
    const value = search?.trim();
    return value ? value : undefined;
  }

  private normalizeSort(sort?: string, defaultSort: 'asc' | 'desc' = 'desc'): 'asc' | 'desc' {
    return sort === 'asc' || sort === 'desc' ? sort : defaultSort;
  }

  private buildSearchFilter(
    search: string,
    mode: 'insensitive' | 'default',
  ): Record<string, unknown> {
    if (mode === 'insensitive') {
      return {
        contains: search,
        mode: 'insensitive',
      };
    }

    return {
      contains: search,
    };
  }
}
