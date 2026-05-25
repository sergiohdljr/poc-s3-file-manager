import { UserDto } from '@my-app/types';
import { User } from '../../domain/entities/user.entity';

export class UserResponseDto implements UserDto {
  id: string;
  name: string;
  email: string;
  createdAt: string;

  constructor(user: User) {
    this.id = user.id;
    this.name = user.name;
    this.email = user.email;
    this.createdAt = user.createdAt.toISOString();
  }
}
