import { IsOptional, IsString } from 'class-validator';

export class FranchiseRequestDto {
  @IsString()
  franchise: string;

  @IsString()
  version: string;

  @IsOptional()
  metadata?: any;

  @IsOptional()
  config?: any;
}
