import { Inject, Injectable, ConflictException } from '@nestjs/common';
import { createHash } from 'crypto';
import { USER_REPOSITORY, UserRepository } from '../../domain/repositories/user.repository';
import { CreateUserDto } from '../dtos/create-user.dto';
import { UserResponseDto } from '../dtos/user-response.dto';
import { UserMapper } from '../mappers/user.mapper';
import { Email } from '../../domain/value-objects/email.vo';
import { User } from '../../domain/entities/user.entity';

@Injectable()
export class CreateUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepo: UserRepository,
  ) {}

  async execute(dto: CreateUserDto): Promise<UserResponseDto> {
    const existing = await this.userRepo.findByEmail(dto.email);
    if (existing) throw new ConflictException('Email already in use');

    const passwordHash = createHash('sha256').update(dto.password).digest('hex');

    const { user } = User.create({
      name: dto.name,
      email: new Email(dto.email),
      passwordHash,
    });

    await this.userRepo.save(user);
    return UserMapper.toDto(user);
  }
}
