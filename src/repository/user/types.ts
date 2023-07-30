import { User } from '@/domain/models/user';

export type CreateUserPayload = {
  userId: string;
  name: string;
  email: string;
  idToken: string;
};

export type FetchByIdPayload = {
  userId: string;
};

export type SearchUsersPayload = {
  query: string;
  nextKey: string;
  size: number;
};

export type BatchGetUsersPayload = {
  userIds: string[];
};

export type SearchUsersResponse = {
  users: User[];
  nextKey: string;
};
