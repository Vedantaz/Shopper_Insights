import { Body, Controller, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './jwt.guard';
import { UpdatePasswordDto } from './dto/update-password.dto';

@Controller('auth')
export class AuthController {
  constructor(private service: AuthService) {}

  @Post('register') register(@Body() dto: RegisterDto) {
    return this.service.register(dto);
  }
  @Post('login') async login(@Body() dto: LoginDto) {
    const user = await this.service.validate(dto.email, dto.password);
    return this.service.login({
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Patch('password')
  updatePassword(@Req() req, @Body() dto: UpdatePasswordDto) {
    return this.service.updatePassword(req.user.userId, dto.newPassword);
  }
}
