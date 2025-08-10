import { IsString, IsNotEmpty, IsEnum, IsEthereumAddress, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../entities/user.entity';

export class CreateUserDto {
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
    description: 'Rôle de l\'utilisateur',
    enum: UserRole,
    example: UserRole.GUEST
  })
  @IsEnum(UserRole)
  role: UserRole;

  @ApiProperty({ 
    description: 'Adresse Ethereum de l\'utilisateur',
    example: '0x742d35Cc6634C0532925a3b8D8b27102e5F1D3F8'
  })
  @IsString()
  @IsNotEmpty()
  @IsEthereumAddress()
  walletAddress: string;
}
