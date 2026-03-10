export type ResponseMeta = {
  page?: number;
  limit?: number;
  totalItems?: number;
  totalPages?: number;
  search?: string;
  column?: string;
  sort?: 'asc' | 'desc';
};
