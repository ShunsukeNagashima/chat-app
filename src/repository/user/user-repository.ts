import dayjs from 'dayjs';

import {
  CreateUserPayload,
  FetchByIdPayload,
  FetchMultipleUsersPayload,
  BatchGetUsersPayload,
  FetchMultipleUsersResponse,
} from './types';

import { UserClass, User } from '@/domain/models/user';
import { userClient, UserClient } from '@/infra/user/user-client';

interface UserRepository {
  create(payload: CreateUserPayload): Promise<User>;
  fetchById(payload: FetchByIdPayload): Promise<User>;
  fetchMultipleUsers(payload: FetchMultipleUsersPayload): Promise<FetchMultipleUsersResponse>;
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
    const { userId } = payload;

    const user = await this.userClient.fetchById(userId);
    return UserClass.create({
      id: user.userId,
      name: user.userName,
      email: user.email,
      profileImageUrl: user.imageUrl,
      createdAt: dayjs(user.createdAt),
    });
  }

  async fetchMultipleUsers(
    payload: FetchMultipleUsersPayload,
  ): Promise<FetchMultipleUsersResponse> {
    const { nextKey } = payload;

    const res = await this.userClient.fetchMultipleUsers(nextKey);

    const users = res.users.map((user) => {
      return UserClass.create({
        id: user.userId,
        name: user.userName,
        email: user.email,
        profileImageUrl: user.imageUrl,
        createdAt: dayjs(user.createdAt),
      });
    });

    return { users: users, nextKey: res.nextKey };
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
