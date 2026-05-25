import { User } from '../../domain/entities/user.entity';
import { Email } from '../../domain/value-objects/email.vo';
import { UserResponseDto } from '../dtos/user-response.dto';

export class UserMapper {
  static toDto(user: User): UserResponseDto {
    return new UserResponseDto(user);
  }

  static toDomain(raw: {
    id: string;
    name: string;
    email: string;
    passwordHash: string;
  }): User {
    return User.reconstitute({
      id: raw.id,
      name: raw.name,
      email: new Email(raw.email),
      passwordHash: raw.passwordHash,
    });
  }
}
