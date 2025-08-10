import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
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

    // Créer l'étudiant
    const student = this.studentRepository.create({
      studentId: createStudentDto.studentId,
      nom: createStudentDto.nom,
      prenom: createStudentDto.prenom,
      email: createStudentDto.email
    });

    const savedStudent = await this.studentRepository.save(student);

    // Gérer les promotions si spécifiées
    if (createStudentDto.promotionIds && createStudentDto.promotionIds.length > 0) {
      // Vérifier que toutes les promotions existent
      const promotions = await this.promotionRepository.find({
        where: { id: In(createStudentDto.promotionIds) }
      });
      
      if (promotions.length !== createStudentDto.promotionIds.length) {
        throw new NotFoundException('Une ou plusieurs promotions non trouvées');
      }

      savedStudent.promotions = promotions;
      await this.studentRepository.save(savedStudent);
    }
    
    // Recharger l'étudiant avec ses promotions
    return await this.studentRepository.findOne({
      where: { id: savedStudent.id },
      relations: ['promotions']
    });
  }

  async findAll(): Promise<Student[]> {
    return await this.studentRepository.find({
      relations: ['promotions'],
      order: { nom: 'ASC', prenom: 'ASC' }
    });
  }

  async findByPromotion(promotionId: string): Promise<Student[]> {
    return await this.studentRepository
      .createQueryBuilder('student')
      .leftJoinAndSelect('student.promotions', 'promotion')
      .where('promotion.id = :promotionId', { promotionId })
      .orderBy('student.nom', 'ASC')
      .addOrderBy('student.prenom', 'ASC')
      .getMany();
  }

  async findOne(id: string): Promise<Student> {
    const student = await this.studentRepository.findOne({
      where: { id },
      relations: ['promotions']
    });

    if (!student) {
      throw new NotFoundException('Étudiant non trouvé');
    }

    return student;
  }

  async findByStudentId(studentId: string): Promise<Student> {
    const student = await this.studentRepository.findOne({
      where: { studentId },
      relations: ['promotions']
    });

    if (!student) {
      throw new NotFoundException('Étudiant non trouvé');
    }

    return student;
  }

  async findByEmail(email: string): Promise<Student> {
    const student = await this.studentRepository.findOne({
      where: { email },
      relations: ['promotions']
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

    // Gérer les promotions si spécifiées
    if (updateStudentDto.promotionIds !== undefined) {
      if (updateStudentDto.promotionIds.length > 0) {
        // Vérifier que toutes les promotions existent
        const promotions = await this.promotionRepository.find({
          where: { id: In(updateStudentDto.promotionIds) }
        });
        
        if (promotions.length !== updateStudentDto.promotionIds.length) {
          throw new NotFoundException('Une ou plusieurs promotions non trouvées');
        }

        student.promotions = promotions;
      } else {
        // Supprimer toutes les promotions
        student.promotions = [];
      }
    }

    // Mettre à jour les autres champs
    if (updateStudentDto.studentId) student.studentId = updateStudentDto.studentId;
    if (updateStudentDto.nom) student.nom = updateStudentDto.nom;
    if (updateStudentDto.prenom) student.prenom = updateStudentDto.prenom;
    if (updateStudentDto.email) student.email = updateStudentDto.email;

    const savedStudent = await this.studentRepository.save(student);
    
    // Recharger l'étudiant avec ses promotions
    return await this.studentRepository.findOne({
      where: { id: savedStudent.id },
      relations: ['promotions']
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
    return await this.studentRepository
      .createQueryBuilder('student')
      .leftJoin('student.promotions', 'promotion')
      .where('promotion.id = :promotionId', { promotionId })
      .getCount();
  }

  async bulkUpdatePromotions(studentIds: string[], promotionIds: string[]): Promise<Student[]> {
    // Vérifier que tous les étudiants existent
    const students = await this.studentRepository.find({
      where: { id: In(studentIds) },
      relations: ['promotions']
    });

    if (students.length !== studentIds.length) {
      throw new NotFoundException('Un ou plusieurs étudiants non trouvés');
    }

    // Vérifier que toutes les promotions existent
    const promotions = await this.promotionRepository.find({
      where: { id: In(promotionIds) }
    });
    
    if (promotions.length !== promotionIds.length) {
      throw new NotFoundException('Une ou plusieurs promotions non trouvées');
    }

    // Mettre à jour les promotions pour chaque étudiant
    for (const student of students) {
      student.promotions = promotions;
      await this.studentRepository.save(student);
    }

    // Retourner les étudiants mis à jour avec leurs promotions
    return await this.studentRepository.find({
      where: { id: In(studentIds) },
      relations: ['promotions']
    });
  }
}
