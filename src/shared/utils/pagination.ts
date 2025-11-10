import { Repository, FindManyOptions, ObjectLiteral } from "typeorm";
import { PaginatedResult } from "../interfaces/paginatedResult.type";

export async function paginate<T extends ObjectLiteral>(
  repository: Repository<T>,
  page = 1,
  limit = 10,
  options: FindManyOptions<T> = {},
  where: any = {}
) : Promise<PaginatedResult<T>> {
  const take = Math.max(1, Math.min(100, limit));
  const skip = (Math.max(1, page) - 1) * take;

  const [data, total] = await repository.findAndCount({
    where,
    ...options,
    skip,
    take,
  });

  const pages = Math.ceil(total / take);

  return {
    data,
    meta: {
      total,
      page,
      pages: pages,
      limit: take,
    },
  };
}