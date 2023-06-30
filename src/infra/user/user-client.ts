import { KyInstance } from 'ky/distribution/types/ky';

import { handleRequest } from '../helper';
import { Room } from '../room/entity/room';

import {
  CreateUserRequest,
  User,
  CreateUserResponse,
  FetchByIdResponse,
  FetchAllRoomsByUserIdReponse,
} from './entity/user';

import { kyInstance } from '@/lib/ky';

export class UserClient {
  constructor(private readonly ky: KyInstance) {}

  async create(req: CreateUserRequest): Promise<User> {
    const response = await handleRequest(
      this.ky.post('api/users', { json: req }).json<CreateUserResponse>(),
    );
    return response.result;
  }

  async fetchById(id: string): Promise<User> {
    const reponse = await handleRequest(this.ky.get(`api/users/${id}`).json<FetchByIdResponse>());
    return reponse.result;
  }

  async fetchAllRoomsByUserId(id: string): Promise<Room[]> {
    const response = await handleRequest(
      this.ky.get(`api/users/${id}/rooms`).json<FetchAllRoomsByUserIdReponse>(),
    );
    return response.result;
  }
}

export const userClient = new UserClient(kyInstance);
