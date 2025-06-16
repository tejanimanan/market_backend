import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Like, Repository } from 'typeorm';
import { ShareData } from './entities/share_data.entity';
import { CreateShareDataDto } from './dto/create-share-data.dto';
import { UpdateShareDataDto } from './dto/update-share-data.dto';
import { User } from '../user/entities/user.entity';
import { Script } from '../script/entities/script.entity';

@Injectable()
export class ShareDataService {
  constructor(
    @InjectRepository(ShareData) private shareDataRepo: Repository<ShareData>,
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Script) private scriptRepo: Repository<Script>,
  ) { }

  async create(dto: CreateShareDataDto) {
    const user = await this.userRepo.findOneBy({ id: dto.user_id });
    if (!user) throw new NotFoundException(`User with id ${dto.user_id} not found`);

    const script = await this.scriptRepo.findOneBy({ id: dto.script_id });
    if (!script) throw new NotFoundException(`Script with id ${dto.script_id} not found`);

    const shareData = this.shareDataRepo.create({
      user,
      script,
      qty: dto.qty,
      type: dto.type,
      price: dto.price,
      profit_loss: dto.profit_loss,
      avgPrice: dto.avgPrice,
      position: dto.position,
    });

    return this.shareDataRepo.save(shareData);
  }

  // async findAll(page = 1, limit = 10, search?: string) {
  //   const skip = (page - 1) * limit;

  //   const query = this.shareDataRepo
  //     .createQueryBuilder('share_data')
  //     .leftJoinAndSelect('share_data.user', 'user')
  //     .leftJoinAndSelect('share_data.script', 'script')
  //     .orderBy('share_data.id', 'ASC')
  //     .skip(skip)
  //     .take(limit);

  //   // Add search condition safely
  //   if (search) {
  //     query.andWhere(
  //       new Brackets(qb => {
  //         qb.where('script.name ILIKE :search', { search: `%${search}%` })
  //           .orWhere('user.name ILIKE :search', { search: `%${search}%` });
  //       }),
  //     );
  //   }

  //   const [data, total] = await query.getManyAndCount();

  //   if (data.length === 0) {
  //     throw new NotFoundException('No shared data found');
  //   }

  //   return {
  //     data,
  //     page,
  //     limit,
  //     total,
  //     totalPages: Math.ceil(total / limit),
  //   };
  // }


  async findAll(page = 1, limit = 10, search?: string, userId?: string, scriptId?: string, startDate?: string,
    endDate?: string,) {
    const skip = (page - 1) * limit;

    const query = this.shareDataRepo
      .createQueryBuilder('share_data')
      .leftJoinAndSelect('share_data.user', 'user')
      .leftJoinAndSelect('share_data.script', 'script')
      .orderBy('share_data.id', 'ASC')
      .skip(skip)
      .take(limit);

    // 🔍 Search by script name or user name
    if (search) {
      query.andWhere(
        new Brackets(qb => {
          qb.where('script.name ILIKE :search', { search: `%${search}%` })
            .orWhere('user.name ILIKE :search', { search: `%${search}%` });
        }),
      );
    }

    // 👤 Filter by user ID
    if (userId) {
      query.andWhere('user.id = :userId', { userId });
    }

    // 📈 Filter by script ID
    if (scriptId) {
      query.andWhere('script.id = :scriptId', { scriptId });
    }
    if (startDate && endDate) {
      query.andWhere('DATE(share_data.create_date) BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      });
    } else if (startDate) {
      query.andWhere('share_data.create_date >= :startDate', { startDate });
    } else if (endDate) {
      query.andWhere('share_data.create_date <= :endDate', { endDate });
    }

    const [data, total] = await query.getManyAndCount();
    return { data, total };
  }


  async findByUserScript(user_id: number, script_id: number) {
    try {
      // Validate input
      if (!user_id || !script_id) {
        throw new Error('Both user_id and script_id are required');
      }

      const query = this.shareDataRepo
        .createQueryBuilder('share_data')
        .leftJoinAndSelect('share_data.user', 'user')
        .leftJoinAndSelect('share_data.script', 'script')
        .where('share_data.user_id = :user_id', { user_id })
        .andWhere('share_data.script_id = :script_id', { script_id })
        .orderBy('share_data.id', 'ASC');

      const [data, count] = await query.getManyAndCount();

      // Add logging to debug the query
      // console.log('Query results:', { 
      //   count, 
      //   data, 
      //   user_id,
      //   script_id
      // });

      return {
        data,
        count,
        total_pages: Math.ceil(count / 10),
        current_page: 1,
      };
    } catch (error) {
      console.error('Error in findByUserScript:', error);
      throw error;
    }
  }

  async findOne(id: number) {
    const shareData = await this.shareDataRepo.findOneBy({ id });
    if (!shareData) throw new NotFoundException(`ShareData with id ${id} not found`);
    return shareData;
  }

  async update(id: number, dto: UpdateShareDataDto) {
    const shareData = await this.shareDataRepo.findOneBy({ id });
    if (!shareData) throw new NotFoundException(`ShareData with id ${id} not found`);

    if (dto.user_id) {
      const user = await this.userRepo.findOneBy({ id: dto.user_id });
      if (!user) throw new NotFoundException(`User with id ${dto.user_id} not found`);
      shareData.user = user;
    }

    if (dto.script_id) {
      const script = await this.scriptRepo.findOneBy({ id: dto.script_id });
      if (!script) throw new NotFoundException(`Script with id ${dto.script_id} not found`);
      shareData.script = script;
    }

    if (dto.qty !== undefined) shareData.qty = dto.qty;
    if (dto.type) shareData.type = dto.type;
    if (dto.price !== undefined) shareData.price = dto.price;
    if (dto.profit_loss !== undefined) shareData.profit_loss = dto.profit_loss;
    if (dto.avgPrice !== undefined) shareData.avgPrice = dto.avgPrice;
    if (dto.position) shareData.position = dto.position;


    return this.shareDataRepo.save(shareData);
  }

  async remove(id: number) {
    const result = await this.shareDataRepo.delete(id);
    if (result.affected === 0) throw new NotFoundException(`ShareData with id ${id} not found`);
    return { message: 'Deleted successfully' };
  }
}
