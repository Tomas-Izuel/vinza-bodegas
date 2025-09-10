export type Meta = {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  itemsPerPage: number;
};

export type PaginatedResponse<T> = {
  items: T[];
  meta: Meta;
};

export type CommonSearchParams = {
  page?: number;
  search?: string;
  limit?: number;
  orderBy?: string;
};
