import { Controller, Get, Post, Body, Patch, Param, Delete, Query, InternalServerErrorException } from '@nestjs/common';
import { ReviewService } from './review.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { Roles } from 'src/auth/roles.decorator';
import { UserRole } from 'src/users/entities/user/user.entity';
import { validateParameters } from 'src/shared/utils/parameters-validation';

@Controller('reviews')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Post()
  @Roles(UserRole.CLIENT)
  create(@Body() createReviewDto: CreateReviewDto) {
    return this.reviewService.create(createReviewDto);
  }

  @Get()
  @Roles(UserRole.VENDOR, UserRole.CLIENT)
  findAll(@Query('page') page?: string, @Query('limit') limit?: string) {
    if(!validateParameters(page, limit)) throw new InternalServerErrorException('Parametros inválidos')
    const options: any = {};
		if (page) options.page = Number(page);
		if (limit) options.limit = Number(limit);
    return this.reviewService.findAll(Object.keys(options).length ? options : {});
  }

  @Get(':id')
  @Roles(UserRole.CLIENT, UserRole.ADMIN)
  findOne(@Param('id') id: string) {
    if(!validateParameters(id)) throw new InternalServerErrorException('Parametros inválidos')
    return this.reviewService.findOne(+id);
  }

  @Patch(':id')
  @Roles(UserRole.CLIENT)
  update(@Param('id') id: string, @Body() updateReviewDto: UpdateReviewDto) {
    if(!validateParameters(id)) throw new InternalServerErrorException('Parametros inválidos')
    return this.reviewService.update(+id, updateReviewDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN, UserRole.CLIENT)
  remove(@Param('id') id: string) {
    if(!validateParameters(id)) throw new InternalServerErrorException('Parametros inválidos')
    return this.reviewService.delete(+id);
  }
}
