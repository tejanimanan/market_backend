import { Controller, Post, Body, UseGuards, Get, Query } from '@nestjs/common';
import { ScriptService } from './script.service';
import { CreateScriptDto } from './dto/create-script.dto';
import { UpdateScriptDto } from './dto/update-script.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('script')
export class ScriptController {
  constructor(private readonly scriptService: ScriptService) { }

  @UseGuards(AuthGuard)
  @Post('fetch-stock-details')
  fetchStockDetails() {
    return this.scriptService.fetchBseStockDetails();
  }
  @UseGuards(AuthGuard)
  @Post('create')
  create(@Body() dto: CreateScriptDto) {
    return this.scriptService.create(dto);
  }

  @UseGuards(AuthGuard)
  @Post('list')
  findAll(@Body() body: { page?: number; limit?: number; search?: string }) {
    const { page = 1, limit = 10, search } = body;
    return this.scriptService.findAll(page, limit, search);
  }

  @UseGuards(AuthGuard)
  @Post('find')
  findOne(@Body() body: { id: number }) {
    return this.scriptService.findOne(body.id);
  }

  @UseGuards(AuthGuard)
  @Post('update')
  update(@Body() body: { id: number } & UpdateScriptDto) {
    const { id, ...dto } = body;
    return this.scriptService.update(id, dto);
  }

  @UseGuards(AuthGuard)
  @Post('delete')
  remove(@Body() body: { id: number }) {
    return this.scriptService.remove(body.id);
  }
  @UseGuards(AuthGuard)
  @Get('chart')
  getStock(@Query('symbol') symbol: string) {
    return this.scriptService.getStockData(symbol || 'AAPL');
  }
}
