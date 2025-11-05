import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService, private jwtService: JwtService) {}

  async validateUser(email: string, pass: string) {
    console.log('Validating user for:', email);
    const user = await this.usersService.findByEmail(email);
    if (!user) return null;
    let valid;
    if (user.password.startsWith('$2b$')){

      valid = await bcrypt.compare(pass, user.password);
    }
    else {
      valid = pass === user.password;
    }

    if(!user.password.startsWith('$2b$') && valid) {
      user.password = await bcrypt.hash(pass, 10);
      const dto = { password: user.password };
      await this.usersService.update(user.id, dto);
    }

    if (valid) {
      const { password, ...result } = user;
      return result;
    }
    throw new UnauthorizedException('Credenciales inválidas');
  }

  async login(user: any) {
    const payload = { sub: user.id, email: user.email };
    return { access_token: this.jwtService.sign(payload) };
  }
}
