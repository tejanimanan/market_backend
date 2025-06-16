import { Controller, Post, Body, Get, Param, Put, Delete, UseGuards } from '@nestjs/common';
import { ShareDataService } from './share_data.service';
import { CreateShareDataDto } from './dto/create-share-data.dto';
import { UpdateShareDataDto } from './dto/update-share-data.dto';
import { AuthGuard } from '../auth/auth.guard';

@Controller('share_data')
export class ShareDataController {
  constructor(private readonly shareDataService: ShareDataService) { }

  @UseGuards(AuthGuard)
  @Post('create')
  create(@Body() dto: CreateShareDataDto) {
    return this.shareDataService.create(dto);
  }

  @UseGuards(AuthGuard)
  @Post('list')
  findAll(
    @Body()
    body: {
      page?: number;
      limit?: number;
      search?: string;
      user_id?: string;
      script_id?: string;
      start_date?: string;  // ✅ Add this
      end_date?: string;    // ✅ And this
    } = {},
  ) {
    const {
      page = 1,
      limit = 10,
      search,
      user_id,
      script_id,
      start_date,
      end_date,
    } = body;

    return this.shareDataService.findAll(
      page,
      limit,
      search,
      user_id,
      script_id,
      start_date,
      end_date, // ✅ Pass to service
    );
  }



  @UseGuards(AuthGuard)
  @Post('find')
  findOne(@Body('id') id: number) {
    return this.shareDataService.findOne(id);
  }

  @UseGuards(AuthGuard)
  @Post('update')
  update(@Body() dto: UpdateShareDataDto & { id: number }) {
    const { id, ...rest } = dto;
    return this.shareDataService.update(id, rest);
  }

  @UseGuards(AuthGuard)
  @Post('delete')
  remove(@Body('id') id: number) {
    return this.shareDataService.remove(id);
  }

  @UseGuards(AuthGuard)
  @Post('find-by-user-script')
  findByUserScript(@Body() body: { user_id: number; script_id: number }) {
    return this.shareDataService.findByUserScript(body.user_id, body.script_id);
  }
}
