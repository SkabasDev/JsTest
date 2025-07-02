import { Injectable, BadRequestException } from '@nestjs/common';
import { PokeapiService } from '../infrastructure/services/pokeapi.service';
import { DigiapiService } from '../infrastructure/services/digiapi.service';
import { InjectRepository } from '@nestjs/typeorm';
import { RequestLog } from '~/models/request-log.model';
import { Repository } from 'typeorm';

@Injectable()
export class FranchiseService {
  constructor(
    @InjectRepository(RequestLog)
    private readonly requestLogRepository: Repository<RequestLog>,
    private readonly pokeapi: PokeapiService,
    private readonly digiapi: DigiapiService,
  ) {}

  async getFranchiseData(franchise: string, version: string, metadata: any, config: any) {
    let status = 'success';
    let error_message: string | null = null;
    let response: any = null;
    try {
      // Permite endpoint flexible o compatibilidad con name/id
      let endpoint = metadata.endpoint;
      if (!endpoint) {
        switch (franchise.toLowerCase()) {
          case 'pokemon':
            endpoint = metadata.name ? `pokemon/${metadata.name}` : '';
            break;
          case 'digimon':
            endpoint = metadata.id ? `digimon/${metadata.id}` : (metadata.name ? `digimon/${metadata.name}` : '');
            break;
          default:
            endpoint = '';
        }
      }
      switch (franchise.toLowerCase()) {
        case 'pokemon':
          response = await this.pokeapi.getPokemon(endpoint, config.baseUrl);
          break;
        case 'digimon':
          response = await this.digiapi.getDigimon(endpoint, config.baseUrl);
          break;
        default:
          throw new BadRequestException('Franquicia no soportada');
      }
      return response;
    } catch (error) {
      status = 'error';
      error_message = error.message;
      throw error;
    } finally {
      const requestLog = new RequestLog();
      requestLog.franchise = franchise;
      requestLog.version = version;
      requestLog.metadata = metadata;
      requestLog.timestamp = new Date();
      requestLog.status = status;
      requestLog.error_message = error_message ?? "";
      await this.requestLogRepository.save(requestLog);
    }
  }
}