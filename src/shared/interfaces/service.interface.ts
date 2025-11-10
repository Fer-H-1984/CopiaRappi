import { PaginatedResult } from "./paginatedResult.type";

export interface IServiceInterface<T, CreateDto, UpdateDto, ResponseDTO = T> {
    findAll(options?: {page?: number; limit?: number; [key: string]: any}): Promise<T[] | PaginatedResult<T> | ResponseDTO[] | PaginatedResult<ResponseDTO>>;
    findOne(id: number): Promise<T | null>;
    create(data: CreateDto): Promise<T | ResponseDTO>; 
    update(id: number, data: UpdateDto): Promise<T> 
    delete(id: number): Promise<void>;
}