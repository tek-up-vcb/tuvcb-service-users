import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { isAddress } from 'ethers';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    // Validation de l'adresse Ethereum
    if (!isAddress(createUserDto.walletAddress)) {
      throw new ConflictException('Adresse Ethereum invalide');
    }

    // Vérifier si l'adresse wallet existe déjà
    const existingUser = await this.usersRepository.findOne({
      where: { walletAddress: createUserDto.walletAddress.toLowerCase() },
    });

    if (existingUser) {
      throw new ConflictException('Cette adresse wallet est déjà utilisée');
    }

    // Normaliser l'adresse en minuscules
    const user = this.usersRepository.create({
      ...createUserDto,
      walletAddress: createUserDto.walletAddress.toLowerCase(),
    });

    return this.usersRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.find({
      order: { dateCreation: 'DESC' },
    });
  }

  async findOne(id: string): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`Utilisateur avec l'ID ${id} non trouvé`);
    }
    return user;
  }

  async findByWalletAddress(walletAddress: string): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { walletAddress: walletAddress.toLowerCase() },
    });
    if (!user) {
      throw new NotFoundException(`Utilisateur avec l'adresse ${walletAddress} non trouvé`);
    }
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);

    // Si on modifie l'adresse wallet, vérifier qu'elle n'existe pas déjà
    if (updateUserDto.walletAddress && updateUserDto.walletAddress !== user.walletAddress) {
      if (!isAddress(updateUserDto.walletAddress)) {
        throw new ConflictException('Adresse Ethereum invalide');
      }

      const existingUser = await this.usersRepository.findOne({
        where: { walletAddress: updateUserDto.walletAddress.toLowerCase() },
      });

      if (existingUser && existingUser.id !== id) {
        throw new ConflictException('Cette adresse wallet est déjà utilisée');
      }

      updateUserDto.walletAddress = updateUserDto.walletAddress.toLowerCase();
    }

    Object.assign(user, updateUserDto);
    return this.usersRepository.save(user);
  }

  async remove(id: string): Promise<void> {
    const user = await this.findOne(id);
    await this.usersRepository.remove(user);
  }

  async count(): Promise<number> {
    return this.usersRepository.count();
  }

  async findByRole(role: string): Promise<User[]> {
    return this.usersRepository.find({
      where: { role: role as any },
      order: { dateCreation: 'DESC' },
    });
  }
}
