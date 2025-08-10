import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Promotion } from './entities/promotion.entity';
import { CreatePromotionDto } from './dto/create-promotion.dto';
import { UpdatePromotionDto } from './dto/update-promotion.dto';

@Injectable()
export class PromotionsService {
  constructor(
    @InjectRepository(Promotion)
    private promotionRepository: Repository<Promotion>,
  ) {}

  async create(createPromotionDto: CreatePromotionDto): Promise<Promotion> {
    // Vérifier si une promotion avec ce nom existe déjà
    const existingPromotion = await this.promotionRepository.findOne({
      where: { nom: createPromotionDto.nom }
    });

    if (existingPromotion) {
      throw new ConflictException('Une promotion avec ce nom existe déjà');
    }

    const promotion = this.promotionRepository.create(createPromotionDto);
    return await this.promotionRepository.save(promotion);
  }

  async findAll(): Promise<Promotion[]> {
    return await this.promotionRepository.find({
      order: { annee: 'DESC', nom: 'ASC' }
    });
  }

  async findActive(): Promise<Promotion[]> {
    return await this.promotionRepository.find({
      where: { isActive: true },
      order: { annee: 'DESC', nom: 'ASC' }
    });
  }

  async findOne(id: string): Promise<Promotion> {
    const promotion = await this.promotionRepository.findOne({
      where: { id },
      relations: ['students']
    });

    if (!promotion) {
      throw new NotFoundException('Promotion non trouvée');
    }

    return promotion;
  }

  async update(id: string, updatePromotionDto: UpdatePromotionDto): Promise<Promotion> {
    const promotion = await this.findOne(id);

    // Vérifier si le nouveau nom n'est pas déjà utilisé
    if (updatePromotionDto.nom && updatePromotionDto.nom !== promotion.nom) {
      const existingPromotion = await this.promotionRepository.findOne({
        where: { nom: updatePromotionDto.nom }
      });

      if (existingPromotion) {
        throw new ConflictException('Une promotion avec ce nom existe déjà');
      }
    }

    Object.assign(promotion, updatePromotionDto);
    return await this.promotionRepository.save(promotion);
  }

  async remove(id: string): Promise<void> {
    const promotion = await this.findOne(id);
    await this.promotionRepository.remove(promotion);
  }

  async count(): Promise<number> {
    return await this.promotionRepository.count();
  }
}
