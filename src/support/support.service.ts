import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateSupportDto } from './dto/create-support.dto';
import { UpdateSupportDto } from './dto/update-support.dto';
import { IServiceInterface } from 'src/shared/interfaces/service.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { Support, SupportCategory, SupportStatus } from './entities/support.entity';
import { Repository } from 'typeorm';
import { UsersService } from 'src/users/users.service';
import { UserRole } from 'src/users/entities/user/user.entity';
import { PaginatedResult } from 'src/shared/interfaces/paginatedResult.type';
import { paginate } from 'src/shared/utils/pagination';

@Injectable()
export class SupportService implements IServiceInterface<Support, CreateSupportDto, UpdateSupportDto>{
  constructor(
    @InjectRepository(Support)
    private readonly supportRepository: Repository<Support>,

    private readonly userService: UsersService
  ){}

  async create(createSupportDto: CreateSupportDto) : Promise<Support> {
    try{

      const user = await this.userService.findOne(createSupportDto.UserId)
      let targetUser

      if(!user || user.role === UserRole.ADMIN){
        throw new InternalServerErrorException('Usuario inválido')
      }

      if (createSupportDto.targetUserId){
        targetUser = await this.userService.findOne(createSupportDto.targetUserId)
        createSupportDto.supportCategory = SupportCategory.ORDER
      }

      const {supportCategory, description} = createSupportDto
    
      const support = this.supportRepository.create({
        supportCategory: supportCategory,
        description: description,
        createdAt: new Date,
        status: SupportStatus.PENDING,
        user: user,
        targetUser
      })

      return await this.supportRepository.save(support);
    }
    catch(error: unknown){
      if(error instanceof Error){
        console.error('No se ha podido enviar el mensaje. Error: '+ error.message )
      }
      else{
        console.error(error)
      }

      throw new InternalServerErrorException('No se ha podido enviar el mensaje. Intente nuevamente mas tarde')
    }
  }

  findAll(options: {page?: number; limit?: number; [key: string]: any} = {}) : Promise<Support[] | PaginatedResult<Support>> {
    const relations = ['user'];

    if (options.limit && options.page) return paginate(this.supportRepository, options.page, options.limit, { relations });
    
    return this.supportRepository.find({ relations });
  }

  async findOne(id: number) : Promise<Support | null> {
    const user = await this.userService.findOne(id)
    if(!user){
      throw new NotFoundException('Usuario no encontrado')
    }
    if(!user.supportRequest){
      throw new NotFoundException('No hay mensajes disponibles')
    }
    return this.supportRepository.findOne({where: { id: user.supportRequest.id }});
  }

  async update(id: number, updateSupportDto: UpdateSupportDto) : Promise<any>{
    try{
      const user = await this.userService.findOne(id)
      if(!user || user.role === UserRole.ADMIN){
        throw new NotFoundException('Usuario no encontrado o inválido')
      }
      const support = await this.supportRepository.findOne({
        where: { user: { id: user.id } },
      });

      if (!support) {
        throw new NotFoundException('Solicitud de soporte no encontrada');
      }

      Object.assign(support, updateSupportDto);
      return await this.supportRepository.save(support);  
    }
    catch (error: unknown){
      if(error instanceof Error){
        console.error('No se ha podido enviar el mensaje. Error: '+ error.message )
      }
      else{
        console.error(error)
      }

      throw new InternalServerErrorException('No se ha podido enviar el mensaje. Intente nuevamente mas tarde')
    }
  }

  delete(id: number) : Promise<any> {
    return this.supportRepository.delete(id);
  }
}
