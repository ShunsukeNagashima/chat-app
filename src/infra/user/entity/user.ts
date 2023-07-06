import { Room } from '@/infra/room/entity/room';

export type User = {
  userId: string;
  userName: string;
  email: string;
};

export type CreateUserRequest = {
  userId: string;
  name: string;
  email: string;
  idToken: string;
};

export type CreateUserResponse = {
  result: User;
};

export type FetchByIdResponse = {
  result: User;
};

export type FetchAllRoomsByUserIdReponse = {
  result: Room[];
};

export type SearchUsersRequest = {
  query: string;
  from: number;
  size: number;
};

export type SearchUsersResponse = {
  result: User[];
};
