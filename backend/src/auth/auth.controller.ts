import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
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
  async updatePassword(@Req() req, @Body() dto: UpdatePasswordDto) {
    return await this.service.updatePassword(req.user.userId, dto.newPassword);
  }

  @Get('/verify')
  verifyToken(@Req() req, @Res() res) {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ valid: false });

    const result = this.service.verify(token);

    if (!result.valid) {
      return res.status(401).json({ valid: false });
    }

    return res.status(200).json({ valid: true, payload: result.payload });
  }
}
