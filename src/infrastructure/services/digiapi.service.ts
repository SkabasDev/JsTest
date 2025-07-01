import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import { DigiApiResponse } from '~/interfaces/external/digiapi-response.interface';

@Injectable()
export class DigiapiService {
  private readonly logger = new Logger(DigiapiService.name);

  async getDigimon(name: string, baseUrl?: string) {
    try {
      const url = `${baseUrl || 'https://digi-api.com/api/v1'}/digimon/${name}`;
      this.logger.log(`Requesting Digimon: ${name}`);
      const response = await axios.get(url);
      const digimon = response.data as DigiApiResponse;
      return {
        name: digimon.name,
        weight: undefined,
        powers: (digimon.levels || []).map((l) => l.level),
        evolutions: (digimon.nextEvolutions || []).map((e) => e.digimon)
      };
    } catch (error) {
      this.logger.error('Error fetching Digimon data', error);
      throw error;
    }
  }
}
