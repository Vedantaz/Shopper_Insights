import { Body, Controller, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './jwt.guard';
import { UpdatePasswordDto } from './dto/update-password.dto';

@Controller('auth')
export class AuthController {
  constructor(private service: AuthService) {}

  @Post('signup')
  async signup(@Body() dto: RegisterDto) {
    const newUser = await this.service.signup(dto);

    return {
      message: `${dto.role} signup successfully`,
      user: newUser,
    };
  }
  @Post('login') async login(@Body() dto: LoginDto) {
    const user = await this.service.login(dto.email, dto.password);
    return {
      message: 'Login successful',
      user: user,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Patch('password')
  updatePassword(@Req() req, @Body() dto: UpdatePasswordDto) {
    return this.service.updatePassword(req.user.userId, dto.newPassword);
  }
}
