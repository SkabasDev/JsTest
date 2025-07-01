import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import { PokeApiSpeciesResponse, PokeApiEvoChainResponse, PokeApiResponse } from '~/interfaces/external/pokeapi-response.interface';

@Injectable()
export class PokeapiService {
  private readonly logger = new Logger(PokeapiService.name);

  async getPokemon(name: string, baseUrl?: string) {
    try {
      const url = `${baseUrl || 'https://pokeapi.co/api/v2'}/pokemon/${name}`;
      this.logger.log(`Requesting Pokémon: ${name}`);
      const response = await axios.get(url);
      const pokemonData = response.data as PokeApiResponse;

      // Obtener evoluciones
      let evolutions: string[] = [];
      try {
        const speciesUrl = pokemonData.species.url;
        const speciesRes = await axios.get(speciesUrl);
        const speciesData = speciesRes.data as PokeApiSpeciesResponse;
        const evoChainUrl = speciesData.evolution_chain.url;
        const evoChainRes = await axios.get(evoChainUrl);
        const evoChainData = evoChainRes.data as PokeApiEvoChainResponse;
        let evo = evoChainData.chain;
        while (evo) {
          evolutions.push(evo.species.name);
          evo = evo.evolves_to && evo.evolves_to[0];
        }
      } catch (e) {
        this.logger.warn('Could not fetch evolutions', e);
        evolutions = [];
      }

      return {
        name: pokemonData.name,
        weight: pokemonData.weight,
        powers: pokemonData.types.map((t: any) => t.type.name),
        evolutions
      };
    } catch (error) {
      this.logger.error('Error fetching Pokémon data', error);
      throw error;
    }
  }
}
