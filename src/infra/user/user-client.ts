import { KyInstance } from 'ky/distribution/types/ky';

import {
  User,
  CreateUserRequest,
  CreateUserResponse,
  FetchByIdRequest,
  FetchByIdResponse,
  SearchUsersRequest,
  SearchUsersResponse,
  BatchGetUsersRequest,
  BatchGetUsersReponse,
} from './entity/user';

import { kyInstance } from '@/lib/ky';

export class UserClient {
  constructor(private readonly ky: KyInstance) {}

  async create(req: CreateUserRequest): Promise<User> {
    const response = await this.ky.post('api/users', { json: req }).json<CreateUserResponse>();
    return response.result;
  }

  async fetchById(req: FetchByIdRequest): Promise<User> {
    const { userId } = req;

    const reponse = await this.ky.get(`api/users/${userId}`).json<FetchByIdResponse>();
    return reponse.result;
  }

  async searchUsers(req: SearchUsersRequest): Promise<User[]> {
    const response = await this.ky
      .get('api/users/search', { searchParams: req })
      .json<SearchUsersResponse>();
    return response.result;
  }

  async batchGet(req: BatchGetUsersRequest): Promise<User[]> {
    const { userIds } = req;
    const params = new URLSearchParams();

    userIds.forEach((userId) => params.append('userIds', userId));

    const response = await this.ky
      .get('api/users/batch', { searchParams: params })
      .json<BatchGetUsersReponse>();
    return response.result;
  }
}

export const userClient = new UserClient(kyInstance);
