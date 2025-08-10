import { IsString, IsNotEmpty, IsEmail, Length, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateStudentDto {
  @ApiProperty({ 
    description: 'ID étudiant manuel unique',
    example: 'ETU2025001',
    minLength: 3,
    maxLength: 50
  })
  @IsString()
  @IsNotEmpty()
  @Length(3, 50)
  studentId: string;

  @ApiProperty({ 
    description: 'Nom de famille',
    example: 'Dupont',
    minLength: 2,
    maxLength: 100
  })
  @IsString()
  @IsNotEmpty()
  @Length(2, 100)
  nom: string;

  @ApiProperty({ 
    description: 'Prénom',
    example: 'Jean',
    minLength: 2,
    maxLength: 100
  })
  @IsString()
  @IsNotEmpty()
  @Length(2, 100)
  prenom: string;

  @ApiProperty({ 
    description: 'Adresse email',
    example: 'jean.dupont@example.com'
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ 
    description: 'ID de la promotion',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @IsUUID()
  @IsNotEmpty()
  promotionId: string;
}
