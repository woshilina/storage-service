import { Module } from '@nestjs/common';
import { PersonnelService } from './personnel.service';
import { PersonnelController } from './personnel.controller';
import { Personnel } from './entities/personnel.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Personnel])],
  controllers: [PersonnelController],
  providers: [PersonnelService],
})
export class PersonnelModule {}
