import { KyInstance } from 'ky/distribution/types/ky';

import { Room } from '../room/entity/room';

import {
  CreateUserRequest,
  User,
  CreateUserResponse,
  FetchByIdResponse,
  FetchAllRoomsByUserIdReponse,
  SearchUsersRequest,
  SearchUsersResponse,
} from './entity/user';

import { kyInstance } from '@/lib/ky';

export class UserClient {
  constructor(private readonly ky: KyInstance) {}

  async create(req: CreateUserRequest): Promise<User> {
    const response = await this.ky.post('api/users', { json: req }).json<CreateUserResponse>();
    return response.result;
  }

  async fetchById(id: string): Promise<User> {
    const reponse = await this.ky.get(`api/users/${id}`).json<FetchByIdResponse>();
    return reponse.result;
  }

  async fetchAllRoomsByUserId(id: string): Promise<Room[]> {
    const response = await this.ky
      .get(`api/users/${id}/rooms`)
      .json<FetchAllRoomsByUserIdReponse>();
    return response.result;
  }

  async searchUsers(req: SearchUsersRequest): Promise<User[]> {
    const response = await this.ky
      .get('api/users/search', { searchParams: req })
      .json<SearchUsersResponse>();
    return response.result;
  }
}

export const userClient = new UserClient(kyInstance);
