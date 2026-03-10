import type { PaginationDto } from '../dtos/pagination.dto';

export type SearchMode = 'insensitive' | 'default';

export type PaginationQueryOptions = {
  searchableColumns?: string[];
  sortableColumns?: string[];
  defaultSortColumn?: string;
  defaultSortOrder?: 'asc' | 'desc';
  maxLimit?: number;
  searchMode?: SearchMode;
};

export type PaginationQueryResult = {
  skip: number;
  take: number;
  where?: Record<string, unknown>;
  orderBy: Record<string, 'asc' | 'desc'>;
  page: number;
  limit: number;
  search?: string;
  column: string;
  sort: 'asc' | 'desc';
};

export type BuildMetaParams = {
  dto: PaginationDto;
  page: number;
  limit: number;
  totalItems: number;
  column: string;
  sort: 'asc' | 'desc';
};
