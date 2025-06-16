import { IsEmail, IsNotEmpty, IsOptional, IsString, IsBoolean, IsIn } from 'class-validator';

export class CreateUserDto {
  
  
  @IsNotEmpty({ message: 'user id is required' })
  uid: number;

  @IsNotEmpty({ message: 'Name is required' })
  @IsString({ message: 'Name must be a string' })
  name: string;

  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Email must be valid' })
  email: string;

  @IsNotEmpty({ message: 'Contact is required' })
  @IsString({ message: 'Contact must be a string' })
  contact: string;

  @IsOptional()
  @IsString({ message: 'Password must be a string' })
  password: string;

  @IsOptional()
  @IsIn(['admin', 'user'], { message: 'Role must be admin or user' })
  role?: 'admin' | 'user';

  @IsOptional()
  @IsBoolean({ message: 'Status must be true or false' })
  status?: boolean;
}
