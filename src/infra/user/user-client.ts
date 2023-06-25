import { KyInstance } from 'ky/distribution/types/ky';

import { Room } from '../room/entity/room';

import { CreateUserRequest, User } from './entity/user';

import { kyInstance } from '@/lib/ky';

export class UserClient {
  constructor(private readonly ky: KyInstance) {}

  async create(req: CreateUserRequest): Promise<User> {
    return await this.ky.post('api/users', { json: req }).json<User>();
  }

  async fetchById(id: string): Promise<User> {
    return await this.ky.get(`api/users/${id}`).json<User>();
  }

  async fetchAllRoomsByUserId(id: string): Promise<Room[]> {
    return await this.ky.get(`api/users/${id}/rooms`).json<Room[]>();
  }
}

export const userClient = new UserClient(kyInstance);
