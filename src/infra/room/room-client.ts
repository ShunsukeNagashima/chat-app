import { KyInstance } from 'ky/distribution/types/ky';

import { Room, CreateRoomRequest, FetchAllByUserIDResponse } from './entity/room';

import { kyInstance } from '@/lib/ky';

export class RoomClient {
  constructor(private readonly ky: KyInstance) {}

  async fetchAllByUserID(userId: string): Promise<FetchAllByUserIDResponse> {
    return await this.ky.get(`api/users/${userId}/rooms`).json<FetchAllByUserIDResponse>();
  }

  async create(req: CreateRoomRequest): Promise<Room> {
    return await this.ky.post('api/rooms', { json: req }).json<Room>();
  }
}

export const roomClient = new RoomClient(kyInstance);
