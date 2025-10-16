import { Body, Controller, Get, Post, Put, Param, Delete } from '@nestjs/common';
import { BackofficeService } from './backoffice.service';
import { CreateBackofficeDto } from './entities/dto/create-backoffice.dto';
import { UpdateBackofficeDto } from './entities/dto/update-backoffice.dto';

@Controller('backoffice')
export class BackofficeController {
    constructor(
        private readonly backofficeService: BackofficeService
    ){}

    @Get()
    findAll(){
        return this.backofficeService.findAll()
    }

    @Post()
    create(@Body() body: CreateBackofficeDto ){
        return this.backofficeService.create(body)
    }

    @Put(':id')
    update(@Param('id') id:string, @Body() body: UpdateBackofficeDto) {
        return this.backofficeService.update(+id, body);
    }

    @Delete(':id')
    delete(@Param('id') id:string) {
        return this.backofficeService.delete(+id);
    }

}
