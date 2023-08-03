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

export type FetchMultipleUsersPayload = {
  nextKey: string;
};

export type BatchGetUsersPayload = {
  userIds: string[];
};

export type FetchMultipleUsersResponse = {
  users: User[];
  nextKey: string;
};
