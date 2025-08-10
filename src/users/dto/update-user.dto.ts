import { PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import { IsBoolean, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiProperty({ 
    description: 'Indique si l\'utilisateur est actif',
    required: false
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
