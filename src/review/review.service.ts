import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Review } from './entities/review.entity';
import { Repository } from 'typeorm';
import { IServiceInterface } from 'src/shared/interfaces/service.interface';
import { User, UserRole } from 'src/users/entities/user/user.entity';
import { Vendor } from 'src/vendors/entities/vendors/vendors.entity';

@Injectable()
export class ReviewService implements IServiceInterface<Review, CreateReviewDto, UpdateReviewDto> {
  constructor(
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Vendor)
    private readonly vendorRepository: Repository<Vendor>,
  ){}

  async create(createReviewDto: CreateReviewDto) : Promise<Review> {
    try {
      const user = await this.userRepository.findOneBy({ id: createReviewDto.userId });
      const vendor = await this.vendorRepository.findOneBy({ id: createReviewDto.vendorId });
      if (!user || user.role !== UserRole.CLIENT) {
        throw new NotFoundException(`Usuario no válido para crear una reseña`);
      }
      if (!vendor) {
        throw new NotFoundException(`Vendedor no encontrado`);
      }

      const review = this.reviewRepository.create({
        rating: createReviewDto.rating,
        comment: createReviewDto.comment,
        createdAt: new Date(),
        User: user,
        Vendor: vendor,
      });

      return await this.reviewRepository.save(review);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.log(error.message);
      } else {
        console.log('Unknown error', error);
      }
      throw new InternalServerErrorException(
        'Error al crear la review. Por favor, inténtalo de nuevo más tarde.',
      );
    }
  }

  findAll(): Promise<Review[]> {
    return this.reviewRepository.find()
  }

  async findOne(id: number): Promise<Review> {
    const review = await this.reviewRepository.findOneBy({ id });
    if (!review) {
      throw new NotFoundException(`review no encontrado`);
    }
    return review;
  }


  async update(id: number, updateReviewDto: UpdateReviewDto) : Promise<Review> {
    const vendor = await this.findOne(id);
    Object.assign(vendor, updateReviewDto);
    return this.reviewRepository.save(vendor);
  }

  delete(id: number): Promise<any> {
    return this.reviewRepository.delete(id)
  }
}
