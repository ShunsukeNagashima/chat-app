import { KyInstance } from 'ky/distribution/types/ky';

import {
  Room,
  CreateRoomRequest,
  AddUsersRequest,
  FetchAllByUserIDResponse,
  CreateRoomResponse,
  AddUsersResponse,
} from './entity/room';

import { kyInstance } from '@/lib/ky';

export class RoomClient {
  constructor(private readonly ky: KyInstance) {}

  async fetchAllByUserId(userId: string): Promise<Room[]> {
    const response = await this.ky
      .get(`api/users/${userId}/rooms`)
      .json<FetchAllByUserIDResponse>();

    return response.result;
  }

  async create(req: CreateRoomRequest): Promise<Room> {
    const response = await this.ky.post('api/rooms', { json: req }).json<CreateRoomResponse>();
    return response.result;
  }

  async addUsers(roomId: string, req: AddUsersRequest): Promise<string> {
    const response = await this.ky
      .post(`api/rooms/${roomId}/users`, { json: req })
      .json<AddUsersResponse>();
    return response.result;
  }
}

export const roomClient = new RoomClient(kyInstance);
