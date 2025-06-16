import { PartialType } from '@nestjs/mapped-types';
import { CreateShareDataDto } from './create-share-data.dto';

export class UpdateShareDataDto extends PartialType(CreateShareDataDto) {
  // all fields optional and same validation as create
}
