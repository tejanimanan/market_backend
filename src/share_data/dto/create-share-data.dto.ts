import { IsInt, IsEnum, IsNotEmpty, IsNumber } from 'class-validator';


export class CreateShareDataDto {
  @IsInt()
  user_id: number;

  @IsInt()
  script_id: number;

  @IsInt()
  qty: number;

  @IsNumber()
  price: number;

  @IsNumber()
  profit_loss: number;

  @IsNumber()
  avgPrice: number;

  @IsEnum(['sell', 'buy'])
  type: 'sell' | 'buy';

  @IsEnum(['open','close'])
  position: 'open' | 'close';
}
