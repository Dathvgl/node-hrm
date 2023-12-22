export type ListResult<T> = {
  totalAll: number;
  currentPage: number;
  data: T[];
};
