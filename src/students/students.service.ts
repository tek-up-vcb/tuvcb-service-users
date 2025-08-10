import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Student } from './entities/student.entity';
import { Promotion } from './entities/promotion.entity';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';

@Injectable()
export class StudentsService {
  constructor(
    @InjectRepository(Student)
    private studentRepository: Repository<Student>,
    @InjectRepository(Promotion)
    private promotionRepository: Repository<Promotion>,
  ) {}

  async create(createStudentDto: CreateStudentDto): Promise<Student> {
    // Vérifier si un étudiant avec cet ID existe déjà
    const existingStudentById = await this.studentRepository.findOne({
      where: { studentId: createStudentDto.studentId }
    });

    if (existingStudentById) {
      throw new ConflictException('Un étudiant avec cet ID existe déjà');
    }

    // Vérifier si un étudiant avec cet email existe déjà
    const existingStudentByEmail = await this.studentRepository.findOne({
      where: { email: createStudentDto.email }
    });

    if (existingStudentByEmail) {
      throw new ConflictException('Un étudiant avec cet email existe déjà');
    }

    // Vérifier que la promotion existe
    const promotion = await this.promotionRepository.findOne({
      where: { id: createStudentDto.promotionId }
    });

    if (!promotion) {
      throw new NotFoundException('Promotion non trouvée');
    }

    const student = this.studentRepository.create(createStudentDto);
    const savedStudent = await this.studentRepository.save(student);
    
    // Recharger l'étudiant avec sa promotion
    return await this.studentRepository.findOne({
      where: { id: savedStudent.id },
      relations: ['promotion']
    });
  }

  async findAll(): Promise<Student[]> {
    return await this.studentRepository.find({
      relations: ['promotion'],
      order: { nom: 'ASC', prenom: 'ASC' }
    });
  }

  async findByPromotion(promotionId: string): Promise<Student[]> {
    return await this.studentRepository.find({
      where: { promotionId },
      relations: ['promotion'],
      order: { nom: 'ASC', prenom: 'ASC' }
    });
  }

  async findOne(id: string): Promise<Student> {
    const student = await this.studentRepository.findOne({
      where: { id },
      relations: ['promotion']
    });

    if (!student) {
      throw new NotFoundException('Étudiant non trouvé');
    }

    return student;
  }

  async findByStudentId(studentId: string): Promise<Student> {
    const student = await this.studentRepository.findOne({
      where: { studentId },
      relations: ['promotion']
    });

    if (!student) {
      throw new NotFoundException('Étudiant non trouvé');
    }

    return student;
  }

  async findByEmail(email: string): Promise<Student> {
    const student = await this.studentRepository.findOne({
      where: { email },
      relations: ['promotion']
    });

    if (!student) {
      throw new NotFoundException('Étudiant non trouvé');
    }

    return student;
  }

  async update(id: string, updateStudentDto: UpdateStudentDto): Promise<Student> {
    const student = await this.findOne(id);

    // Vérifier si le nouvel ID étudiant n'est pas déjà utilisé
    if (updateStudentDto.studentId && updateStudentDto.studentId !== student.studentId) {
      const existingStudent = await this.studentRepository.findOne({
        where: { studentId: updateStudentDto.studentId }
      });

      if (existingStudent) {
        throw new ConflictException('Un étudiant avec cet ID existe déjà');
      }
    }

    // Vérifier si le nouvel email n'est pas déjà utilisé
    if (updateStudentDto.email && updateStudentDto.email !== student.email) {
      const existingStudent = await this.studentRepository.findOne({
        where: { email: updateStudentDto.email }
      });

      if (existingStudent) {
        throw new ConflictException('Un étudiant avec cet email existe déjà');
      }
    }

    // Vérifier que la promotion existe si elle est modifiée
    if (updateStudentDto.promotionId && updateStudentDto.promotionId !== student.promotionId) {
      const promotion = await this.promotionRepository.findOne({
        where: { id: updateStudentDto.promotionId }
      });

      if (!promotion) {
        throw new NotFoundException('Promotion non trouvée');
      }
    }

    Object.assign(student, updateStudentDto);
    const savedStudent = await this.studentRepository.save(student);
    
    // Recharger l'étudiant avec sa promotion
    return await this.studentRepository.findOne({
      where: { id: savedStudent.id },
      relations: ['promotion']
    });
  }

  async remove(id: string): Promise<void> {
    const student = await this.findOne(id);
    await this.studentRepository.remove(student);
  }

  async count(): Promise<number> {
    return await this.studentRepository.count();
  }

  async countByPromotion(promotionId: string): Promise<number> {
    return await this.studentRepository.count({
      where: { promotionId }
    });
  }
}
