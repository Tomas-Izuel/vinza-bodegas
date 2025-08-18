export type Meta = {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  itemsPerPage: number;
};

export type CommonSearchParams = {
  page?: number;
  search?: string;
  limit?: number;
  orderBy?: string;
};
