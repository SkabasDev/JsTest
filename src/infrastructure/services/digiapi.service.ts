import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import { DigiApiResponse } from '~/interfaces/external/digiapi-response.interface';

@Injectable()
export class DigiapiService {
  private readonly logger = new Logger(DigiapiService.name);

  async getDigimon(endpoint: string, baseUrl?: string) {
    try {
      const url = `${baseUrl || 'https://digi-api.com/api/v1'}/${endpoint}`;
      this.logger.log(`Requesting DigiAPI endpoint: ${url}`);
      const response = await axios.get(url);
      // Si el endpoint es 'digimon/<id>' se puede mapear como antes
      if (endpoint.startsWith('digimon/')) {
        const digimon = response.data as DigiApiResponse;
        return {
          name: digimon.name,
          weight: undefined,
          powers: (digimon.levels || []).map((l) => l.level),
          evolutions: (digimon.nextEvolutions || []).map((e) => e.digimon)
        };
      }
      // Para otros endpoints, retorna el resultado crudo
      return response.data;
    } catch (error) {
      this.logger.error('Error fetching Digimon data', error);
      throw error;
    }
  }
}
