import { Injectable, ConflictException, InternalServerErrorException, NotFoundException, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository, Not } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcryptjs';
import { Script } from 'src/script/entities/script.entity';
import { ShareData } from 'src/share_data/entities/share_data.entity';

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private repo: Repository<User>,
  @InjectRepository(Script) private scriptRepo: Repository<Script>,
  @InjectRepository(ShareData) private shareDataRepo: Repository<ShareData>,) {}

  async create(dto: CreateUserDto) {
    const password = await bcrypt.hash(dto.password, 10);
    const user = this.repo.create({ ...dto, password });

    try {
      return await this.repo.save(user);
    } catch (error) {
      if (error.code === '23505') {
      // Unique violation
      const detail = error.detail;

      if (detail.includes('email')) {
        throw new ConflictException('Email already exists');
      }

      if (detail.includes('uid')) {
        throw new ConflictException('UID already exists');
      }

      // Optional: handle more cases
      throw new ConflictException('Duplicate value found');
    }

      throw new InternalServerErrorException('Failed to create user');
    }
  }


async findAll(
  page = 1,
  limit = 10,
  search?: string,
) {
  const skip = (page - 1) * limit;
 
  const query = this.repo
    .createQueryBuilder('user')
    .where('user.role != :role', { role: 'admin' });
 
  if (search) {
    query.andWhere(
      '(user.name ILIKE :search OR user.email ILIKE :search)',
      { search: `%${search}%` }
    );
  }
 
  query.skip(skip).take(limit).orderBy('user.id', 'ASC');
 
  const [users, total] = await query.getManyAndCount();
 
  if (users.length === 0) {
    throw new NotFoundException('No users found');
  }
 
  return {
    data: users,
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
  };
}
  async findOne(id: number) {
    const user = await this.repo.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async findByEmail(email: string) {
    const user = await this.repo.findOneBy({ email });
    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }
    return user;
  }

  async update(id: number, dto: UpdateUserDto) {
    const user = await this.findOne(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    try {
      await this.repo.update(id, dto);
      return this.findOne(id);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('Email already exists');
      }
      throw new InternalServerErrorException('Failed to update user');
    }
  }

  async delete(id: number) {
    const user = await this.findOne(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    try {
      await this.repo.delete(id);
      return { message: 'User deleted successfully' };
    } catch (error) {
      throw new InternalServerErrorException('Failed to delete user');
    }
  }

   async getDashboardCounts() {
   const userCount = await this.repo.count({
    where: {
      role: Not("admin")
    }
  });
    const scriptCount = await this.scriptRepo.count();
    const shareDataCount = await this.shareDataRepo.count();

    return {
      users: userCount,
      scripts: scriptCount,
      shareData: shareDataCount,
    };
  }


  
  
async resetPassword(email: string, newPassword: string, oldPassword?: string) {
  const user = await this.repo.findOne({ where: { email } });

  if (!user) {
    throw new HttpException('User not found', HttpStatus.NOT_FOUND);
  }

  if (oldPassword && !(await bcrypt.compare(oldPassword, user.password))) {
    throw new HttpException('Invalid credentials', HttpStatus.BAD_REQUEST);
  }

  user.password = await bcrypt.hash(newPassword, 10);
  await this.repo.save(user);

  const { password, ...userSafe } = user;
  return {
    statusCode: HttpStatus.OK,
    message: 'Password updated successfully',
    data: userSafe,
  };
}

}
