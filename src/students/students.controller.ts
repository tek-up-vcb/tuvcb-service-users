import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  Query 
} from '@nestjs/common';
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiParam, 
  ApiQuery 
} from '@nestjs/swagger';
import { StudentsService } from './students.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { Student } from './entities/student.entity';

@ApiTags('Students')
@Controller('api/students')
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @Post()
  @ApiOperation({ summary: 'Créer un nouvel étudiant' })
  @ApiResponse({ status: 201, description: 'Étudiant créé avec succès', type: Student })
  @ApiResponse({ status: 400, description: 'Données invalides' })
  @ApiResponse({ status: 409, description: 'ID étudiant ou email déjà utilisé' })
  create(@Body() createStudentDto: CreateStudentDto): Promise<Student> {
    return this.studentsService.create(createStudentDto);
  }

  @Get('count')
  @ApiOperation({ summary: 'Compter le nombre d\'étudiants' })
  @ApiResponse({ status: 200, description: 'Nombre d\'étudiants' })
  async count(): Promise<{ count: number }> {
    const count = await this.studentsService.count();
    return { count };
  }

  @Get('student-id/:studentId')
  @ApiOperation({ summary: 'Trouver un étudiant par son ID étudiant' })
  @ApiParam({ name: 'studentId', description: 'ID étudiant' })
  @ApiResponse({ status: 200, description: 'Étudiant trouvé', type: Student })
  @ApiResponse({ status: 404, description: 'Étudiant non trouvé' })
  findByStudentId(@Param('studentId') studentId: string): Promise<Student> {
    return this.studentsService.findByStudentId(studentId);
  }

  @Get('email/:email')
  @ApiOperation({ summary: 'Trouver un étudiant par son email' })
  @ApiParam({ name: 'email', description: 'Email de l\'étudiant' })
  @ApiResponse({ status: 200, description: 'Étudiant trouvé', type: Student })
  @ApiResponse({ status: 404, description: 'Étudiant non trouvé' })
  findByEmail(@Param('email') email: string): Promise<Student> {
    return this.studentsService.findByEmail(email);
  }

  @Get()
  @ApiOperation({ summary: 'Récupérer tous les étudiants' })
  @ApiQuery({ name: 'promotionId', required: false, description: 'Filtrer par promotion' })
  @ApiResponse({ status: 200, description: 'Liste des étudiants', type: [Student] })
  findAll(@Query('promotionId') promotionId?: string): Promise<Student[]> {
    if (promotionId) {
      return this.studentsService.findByPromotion(promotionId);
    }
    return this.studentsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Récupérer un étudiant par son ID' })
  @ApiParam({ name: 'id', description: 'ID de l\'étudiant' })
  @ApiResponse({ status: 200, description: 'Étudiant trouvé', type: Student })
  @ApiResponse({ status: 404, description: 'Étudiant non trouvé' })
  findOne(@Param('id') id: string): Promise<Student> {
    return this.studentsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Mettre à jour un étudiant' })
  @ApiParam({ name: 'id', description: 'ID de l\'étudiant' })
  @ApiResponse({ status: 200, description: 'Étudiant mis à jour', type: Student })
  @ApiResponse({ status: 404, description: 'Étudiant non trouvé' })
  @ApiResponse({ status: 409, description: 'ID étudiant ou email déjà utilisé' })
  update(@Param('id') id: string, @Body() updateStudentDto: UpdateStudentDto): Promise<Student> {
    return this.studentsService.update(id, updateStudentDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Supprimer un étudiant' })
  @ApiParam({ name: 'id', description: 'ID de l\'étudiant' })
  @ApiResponse({ status: 200, description: 'Étudiant supprimé' })
  @ApiResponse({ status: 404, description: 'Étudiant non trouvé' })
  async remove(@Param('id') id: string): Promise<{ message: string }> {
    await this.studentsService.remove(id);
    return { message: 'Étudiant supprimé avec succès' };
  }
}
