import { Controller, Post, Body, Param, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(AuthGuard)
  @Post('create_user')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  create(@Body() dto: CreateUserDto) {
    return this.userService.create(dto);
  }

@UseGuards(AuthGuard)
@Post('user_list')
async findAll(@Body() body: { page?: number; limit?: number; search?: string }) {
  const { page = 1, limit = 10, search } = body;
  return this.userService.findAll(page, limit, search);
}


  @UseGuards(AuthGuard)
  @Post('particular_user')
  findOne(@Body('id') id: number) {
    return this.userService.findOne(+id);
  }

  @UseGuards(AuthGuard)
  @Post('update_user')
  async update(@Body() body: any) {
    const { id, ...updateData } = body;

    if (!id) {
      return { statusCode: 400, message: 'id is required', error: 'Bad Request' };
    }

    return this.userService.update(id, updateData);
  }

  @UseGuards(AuthGuard)
  @Post('delete_user')
  remove(@Body('id') id: number) {
    return this.userService.delete(+id);
  }

   @UseGuards(AuthGuard)
  @Post('dashboard')
  getDashboardCounts() {
    return this.userService.getDashboardCounts();
  }
}
