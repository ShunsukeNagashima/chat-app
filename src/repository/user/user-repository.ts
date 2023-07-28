import dayjs from 'dayjs';

import {
  CreateUserPayload,
  FetchByIdPayload,
  SearchUsersPayload,
  BatchGetUsersPayload,
} from './types';

import { UserClass, User } from '@/domain/models/user';
import { userClient, UserClient } from '@/infra/user/user-client';

interface UserRepository {
  create(payload: CreateUserPayload): Promise<User>;
  fetchById(payload: FetchByIdPayload): Promise<User>;
  search(payload: SearchUsersPayload): Promise<User[]>;
  batchGet(payload: BatchGetUsersPayload): Promise<User[]>;
}

export class UserRepositoryImpl implements UserRepository {
  constructor(private readonly userClient: UserClient) {}

  async create(payload: CreateUserPayload): Promise<User> {
    const user = await this.userClient.create(payload);

    return UserClass.create({
      id: user.userId,
      name: user.userName,
      email: user.email,
      profileImageUrl: user.imageUrl,
      createdAt: dayjs(user.createdAt),
    });
  }

  async fetchById(payload: FetchByIdPayload): Promise<User> {
    const user = await this.userClient.fetchById(payload);
    return UserClass.create({
      id: user.userId,
      name: user.userName,
      email: user.email,
      profileImageUrl: user.imageUrl,
      createdAt: dayjs(user.createdAt),
    });
  }

  async search(payload: SearchUsersPayload): Promise<User[]> {
    const users = await this.userClient.searchUsers(payload);

    return users.map((user) => {
      return UserClass.create({
        id: user.userId,
        name: user.userName,
        email: user.email,
        profileImageUrl: user.imageUrl,
        createdAt: dayjs(user.createdAt),
      });
    });
  }

  async batchGet(payload: BatchGetUsersPayload): Promise<User[]> {
    const users = await this.userClient.batchGet(payload);

    return users.map((user) => {
      return UserClass.create({
        id: user.userId,
        name: user.userName,
        email: user.email,
        profileImageUrl: user.imageUrl,
        createdAt: dayjs(user.createdAt),
      });
    });
  }
}

export const userRepository = new UserRepositoryImpl(userClient);
