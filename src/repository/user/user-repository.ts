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
    });
  }

  async fetchById(payload: FetchByIdPayload): Promise<User> {
    const user = await this.userClient.fetchById(payload);
    return UserClass.create({
      id: user.userId,
      name: user.userName,
      email: user.email,
    });
  }

  async search(payload: SearchUsersPayload): Promise<User[]> {
    const users = await this.userClient.searchUsers(payload);

    return users.map((user) => {
      return UserClass.create({
        id: user.userId,
        name: user.userName,
        email: user.email,
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
      });
    });
  }
}

export const userRepository = new UserRepositoryImpl(userClient);
