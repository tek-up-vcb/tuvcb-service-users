import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete 
} from '@nestjs/common';
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiParam 
} from '@nestjs/swagger';
import { PromotionsService } from './promotions.service';
import { CreatePromotionDto } from './dto/create-promotion.dto';
import { UpdatePromotionDto } from './dto/update-promotion.dto';
import { Promotion } from './entities/promotion.entity';

@ApiTags('Promotions')
@Controller('api/promotions')
export class PromotionsController {
  constructor(private readonly promotionsService: PromotionsService) {}

  @Post()
  @ApiOperation({ summary: 'Créer une nouvelle promotion' })
  @ApiResponse({ status: 201, description: 'Promotion créée avec succès', type: Promotion })
  @ApiResponse({ status: 400, description: 'Données invalides' })
  @ApiResponse({ status: 409, description: 'Nom de promotion déjà utilisé' })
  create(@Body() createPromotionDto: CreatePromotionDto): Promise<Promotion> {
    return this.promotionsService.create(createPromotionDto);
  }

  @Get('count')
  @ApiOperation({ summary: 'Compter le nombre de promotions' })
  @ApiResponse({ status: 200, description: 'Nombre de promotions' })
  async count(): Promise<{ count: number }> {
    const count = await this.promotionsService.count();
    return { count };
  }

  @Get('active')
  @ApiOperation({ summary: 'Récupérer toutes les promotions actives' })
  @ApiResponse({ status: 200, description: 'Liste des promotions actives', type: [Promotion] })
  findActive(): Promise<Promotion[]> {
    return this.promotionsService.findActive();
  }

  @Get()
  @ApiOperation({ summary: 'Récupérer toutes les promotions' })
  @ApiResponse({ status: 200, description: 'Liste des promotions', type: [Promotion] })
  findAll(): Promise<Promotion[]> {
    return this.promotionsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Récupérer une promotion par son ID' })
  @ApiParam({ name: 'id', description: 'ID de la promotion' })
  @ApiResponse({ status: 200, description: 'Promotion trouvée', type: Promotion })
  @ApiResponse({ status: 404, description: 'Promotion non trouvée' })
  findOne(@Param('id') id: string): Promise<Promotion> {
    return this.promotionsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Mettre à jour une promotion' })
  @ApiParam({ name: 'id', description: 'ID de la promotion' })
  @ApiResponse({ status: 200, description: 'Promotion mise à jour', type: Promotion })
  @ApiResponse({ status: 404, description: 'Promotion non trouvée' })
  @ApiResponse({ status: 409, description: 'Nom de promotion déjà utilisé' })
  update(@Param('id') id: string, @Body() updatePromotionDto: UpdatePromotionDto): Promise<Promotion> {
    return this.promotionsService.update(id, updatePromotionDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Supprimer une promotion' })
  @ApiParam({ name: 'id', description: 'ID de la promotion' })
  @ApiResponse({ status: 200, description: 'Promotion supprimée' })
  @ApiResponse({ status: 404, description: 'Promotion non trouvée' })
  async remove(@Param('id') id: string): Promise<{ message: string }> {
    await this.promotionsService.remove(id);
    return { message: 'Promotion supprimée avec succès' };
  }
}
