export interface UserDto {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

export interface CreateUserDto {
  name: string;
  email: string;
  password: string;
}

export interface PaginatedDto<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}
