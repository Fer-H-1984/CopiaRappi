export interface IServiceInterface<T, CreateDto, UpdateDto> {
    findAll(): Promise<T[]>;
    findOne(id: number): Promise<T | null>;
    create(data: CreateDto): Promise<T>; 
    update(id: number, data: UpdateDto): Promise<T> 
    delete(id: number): Promise<void>;
}