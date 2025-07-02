import { Module } from '@nestjs/common';
import { FranchiseService } from './franchise.service';
import { FranchiseController } from './franchise.controller';
import { PokeapiService } from '../infrastructure/services/pokeapi.service';
import { DigiapiService } from '../infrastructure/services/digiapi.service';
import { RequestLog } from '../models/request-log.model';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([RequestLog])],
  controllers: [FranchiseController],
  providers: [FranchiseService, PokeapiService, DigiapiService],
  exports: [FranchiseService],
})
export class FranchiseModule {}
