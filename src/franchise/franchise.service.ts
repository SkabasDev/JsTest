import { Injectable, BadRequestException } from '@nestjs/common';
import { PokeapiService } from '../infrastructure/services/pokeapi.service';
import { DigiapiService } from '../infrastructure/services/digiapi.service';

@Injectable()
export class FranchiseService {
  constructor(
    private readonly pokeapi: PokeapiService,
    private readonly digiapi: DigiapiService,
  ) {}

  async getFranchiseData(franchise: string, version: string, metadata: any, config: any) {
    switch (franchise.toLowerCase()) {
      case 'pokemon':
        return this.pokeapi.getPokemon(metadata.name, config.baseUrl);
      case 'digimon':
        return this.digiapi.getDigimon(metadata.name, config.baseUrl);
      default:
        throw new BadRequestException('Franquicia no soportada');
    }
  }
}