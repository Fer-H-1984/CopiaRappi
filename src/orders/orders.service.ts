import { Injectable, NotFoundException, Inject, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IServiceInterface } from 'src/shared/interfaces/service.interface';
import { Order } from './entities/orders/orders.entity';
import { Repository } from 'typeorm';
import { CreateOrdersDto } from './entities/dto/create-orders.dto';
import { UpdateOrderDto } from './entities/dto/update-order.dto';
import { OrderSummaryDto } from './entities/dto/order-summary.dto';
import { UsersService } from 'src/users/users.service';
import { OrderItem } from './entities/orders/order-item.entity';
import { ProductsService } from 'src/products/products.service';
import { OrderStatus } from './entities/orders/orders.entity';
import { PaymentsService } from 'src/payments/payments/payments.service';
import { plainToInstance } from 'class-transformer';
import { PaymentResponseDto } from 'src/payments/payments/dto/payment-response.dto';
import { PaginatedResult } from 'src/shared/interfaces/paginatedResult.type';
import { paginate } from 'src/shared/utils/pagination';

@Injectable()
export class OrdersService implements IServiceInterface<Order, CreateOrdersDto, UpdateOrderDto> {
    constructor(
        @InjectRepository(Order)
        private readonly orderRepository: Repository<Order>,
        @InjectRepository(OrderItem)
        private readonly orderItemRepository: Repository<OrderItem>,
        
        private readonly userService: UsersService,
        private readonly productService: ProductsService,
        @Inject(forwardRef(() => PaymentsService))
        private readonly paymentsService: PaymentsService
    ) {}

    findAll(options: {page?: number; limit?: number; [key: string]: any} = {} ): Promise<Order[] | PaginatedResult<Order>> {
        
        if(options.limit && options.page) return paginate(this.orderRepository, options.page, options.limit, {relations:['user']})
        
        return this.orderRepository.find({
            relations: ['user'] 
        });
    }

    findOne(id: number): Promise<Order | null> {
        return this.orderRepository.findOne({
            where: { id: id },
            relations: ['user'],
        }) || Promise.reject('Orden no encontrada');
    }


    async create(createOrderDto: CreateOrdersDto): Promise<Order> {
        const user = await this.userService.findOne(createOrderDto.User.id)
        if (!user) throw new NotFoundException('Usuario no encontrado');

        const orderItems: OrderItem[] = [];
        let totalAmount = 0;

        for (const itemDto of createOrderDto.items) {
            const product = await this.productService.findOne(itemDto.productId)
            if (!product) throw new NotFoundException(`Producto no encontrado`);

            const subtotal = Number(product.price) * itemDto.quantity;
            totalAmount += subtotal;

            const orderItem = this.orderItemRepository.create({
                product,
                quantity: itemDto.quantity,
                price: product.price,
                subtotal,
            });
            orderItems.push(orderItem);
        }

        const order = this.orderRepository.create({
            user: user,
            items: orderItems,
            totalAmount: totalAmount,
            status: OrderStatus.PENDING,
            createdAt: new Date(),
        });

        const saved = await this.orderRepository.save(order);

        if (createOrderDto.payment) {
            // construimos DTO para PaymentsService
            const payDto = {
                orderId: saved.id,
                userId: user.id,
                amount: createOrderDto.payment.amount ?? totalAmount,
                methodId: createOrderDto.payment.methodId,
            };
            await this.paymentsService.create(payDto as any);
        }

        return saved;
    }
    

    update(id: number, body: UpdateOrderDto) : Promise<any> {
        return this.orderRepository.update(id, body);
    }

    delete(id: number) : Promise<any> {
        return this.orderRepository.delete(id);
    }

    async findByUserId(userId: number): Promise<Order[]> {
        return this.orderRepository.find({
            where: { user: { id: userId } },
            relations: ['user'],
        });
    }

    async getSummary(id: number) {
        const order = await this.orderRepository.findOne({
            where: { id },
            relations: ['user', 'items', 'items.product', 'payments', 'payments.method', 'payments.user', 'driver'],
        });

        if (!order) throw new NotFoundException('Pedido no encontrado');

        console.log('Orden:', order.id);
    console.log('Pagos:', order.payments?.length ? order.payments : 'Sin pagos asociados');
        const totalItems = order.items.reduce((acc, item) => acc + item.quantity, 0);
        const totalAmount = order.items.reduce((acc, item) => acc + (item.price * item.quantity), 0); 

        // Mapear los payments a PaymentResponseDto[] asegurando tipos correctos
        const paymentDtos = plainToInstance(
            PaymentResponseDto,
            (order.payments || []).map(p => ({
                id: p.id,
                status: p.status,
                transactionId: p.transactionId,
                amount: typeof p.amount === 'string' ? parseFloat(p.amount as any) : p.amount,
                createdAt: p.createdAt,
                method: p.method ? { id: p.method.id, name: p.method.name } : undefined,
                user: p.user ? { id: p.user.id, email: p.user.email } : undefined,
            })),
            { excludeExtraneousValues: true },
        );
        const dto = new OrderSummaryDto();
        dto.status = OrderStatus.COMPLETED;
        dto.payments = paymentDtos;
        dto.totalAmount = totalAmount;
        dto.totalItems = totalItems;
        return dto;
    }
}
