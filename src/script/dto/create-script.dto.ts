import { IsString, IsBoolean, IsNumber, IsOptional, IsEnum } from 'class-validator';

export class CreateScriptDto {
  @IsString()
  name: string;

  @IsNumber()
  current_rate: number;

  @IsOptional()
  @IsBoolean()
  status?: boolean;

  @IsOptional()
  @IsNumber()
  high_value?: number;

  @IsOptional()
  @IsNumber()
  low_value?: number;

  @IsOptional()
  @IsNumber()
  volume?: number;

  @IsOptional()
  @IsNumber()
  closing_price?: number;

  @IsOptional()
  @IsEnum(['NSE', 'BSE'])
  type?: 'NSE' | 'BSE';
}
