import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  async validateUser(email: string, pass: string) {
    email.toLowerCase().trim()
    const user = await this.usersService.findByEmail(email);
    if (!user) return null;

    let valid: boolean;

    // Si la contraseña ya está hasheada con bcrypt
    if (user.password.startsWith('$2b$')) {
      valid = await bcrypt.compare(pass, user.password);
    } 
    // Si es legacy (texto plano)
    else {
      valid = pass === user.password;
    }

    // Migración automática de legacy a bcrypt
    if (!user.password.startsWith('$2b$') && valid) {
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
    const payload = { 
      sub: user.id, 
      email: user.email, 
      role: user.role,
      vendorProfileId: user.vendorProfile?.id ?? null,
      driverProfileId: user.driverProfile?.id ?? null,
      backOfficeProfileId: user.backOfficeProfile?.id ?? null,
    };
    
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        vendorProfileId: user.vendorProfile?.id ?? null,
        driverProfileId: user.driverProfile?.id ?? null,
        backOfficeProfileId: user.backOfficeProfile?.id ?? null,
      },
    };
  }
}
