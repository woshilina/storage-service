import { PartialType } from '@nestjs/swagger';
import { CreatePersonnelDto } from './create-personnel.dto';

export class UpdatePersonnelDto extends PartialType(CreatePersonnelDto) {}
