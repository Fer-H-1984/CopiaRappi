import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { Public } from './public.decorator';
import { CreateUserDto } from 'src/users/entities/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService, private readonly usersService: UsersService) {}

  @Post('login')
  @Public()
  async login(@Body() body: LoginDto) {
    console.log('Login attempt for:', body.email);
    const user = await this.authService.validateUser(body.email, body.password);
    if (!user) throw new UnauthorizedException('Credenciales inválidas');
    return this.authService.login(user);
  }

  @Post('register')
  @Public()
  async create(@Body() body: CreateUserDto) {
    const user = await this.usersService.create(body)
    return user;
  }

}
