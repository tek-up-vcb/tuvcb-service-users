import { IsString, IsNotEmpty, IsInt, IsOptional, Length, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePromotionDto {
  @ApiProperty({ 
    description: 'Nom de la promotion',
    example: 'Promo25',
    minLength: 2,
    maxLength: 100
  })
  @IsString()
  @IsNotEmpty()
  @Length(2, 100)
  nom: string;

  @ApiProperty({ 
    description: 'Description de la promotion',
    example: 'Promotion 2025 - Développement Web',
    required: false
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ 
    description: 'Année de la promotion',
    example: 2025
  })
  @IsInt()
  @Min(2020)
  annee: number;
}
