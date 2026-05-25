import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { CreateUserDto } from '@my-app/types';
import { userApi } from '../infrastructure/user.api';

export function useUser(id: string) {
  return useQuery({
    queryKey: ['users', id],
    queryFn: () => userApi.getById(id),
    enabled: !!id,
  });
}

export function useCreateUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateUserDto) => userApi.create(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['users'] }),
  });
}
