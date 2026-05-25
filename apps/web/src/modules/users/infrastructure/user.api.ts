import { CreateUserDto, UserDto } from '@my-app/types';
import { httpClient } from '../../../shared/lib/http-client';

export const userApi = {
  getById: (id: string) =>
    httpClient.get<UserDto>(`/users/${id}`).then((r) => r.data),

  create: (payload: CreateUserDto) =>
    httpClient.post<UserDto>('/users', payload).then((r) => r.data),
};
