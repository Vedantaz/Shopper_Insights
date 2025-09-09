import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto';
import { Role } from 'src/common/role.enum';
import jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  private readonly JWT_SECRET: string;
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private configService: ConfigService,
  ) {
    this.JWT_SECRET =
      this.configService.get<string>('JWT_SECRET') || 'changeIt';
  }

  async signup(dto: RegisterDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }
    const hash = await bcrypt.hash(dto.password, 10);
    const role = Role;
    if (!role) {
      throw new ConflictException('Role must be defined');
    }
    const user = await this.prisma.user.create({
      data: {
        name: dto.name,
        email: dto.email,
        address: dto.address,
        passwordHash: hash,
        role: (dto.role as Role) || Role.USER,
      },
      select: { id: true, name: true, email: true, address: true, role: true },
    });

    return user;
  }

  async validateUser(email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    };
  }

  async login(email: string, password: string) {
    const validUser = await this.validateUser(email, password);

    const payload = {
      sub: validUser.id,
      role: validUser.role,
      email: validUser.email,
      name: validUser.name,
    };
    return { accessToken: await this.jwt.signAsync(payload), user: validUser };
  }

  async updatePassword(userId: number, newPassword: string) {
    const passwordHash = await bcrypt.hash(newPassword, 10);
    await this.prisma.user.update({
      where: { id: userId },
      data: { passwordHash },
    });
    return { success: true };
  }

  verify(token: string): { valid: boolean; payload?: any } {
    try {
      const payload = jwt.verify(token, this.JWT_SECRET);
      return { valid: true, payload };
    } catch (err) {
      return { valid: false };
    }
  }
}
