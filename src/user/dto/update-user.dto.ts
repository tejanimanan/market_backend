import { IsOptional, IsString, IsBoolean, IsIn } from 'class-validator';

export class UpdateUserDto {
  
  @IsOptional()
  uid?: number;

  @IsOptional()
  @IsString({ message: 'Name must be a string' })
  name?: string;

  @IsOptional()
  @IsString({ message: 'Contact must be a string' })
  contact?: string;

  @IsOptional()
  @IsIn(['admin', 'user'], { message: 'Role must be admin or user' })
  role?: 'admin' | 'user';

  @IsOptional()
  @IsBoolean({ message: 'Status must be true or false' })
  status?: boolean;
}
