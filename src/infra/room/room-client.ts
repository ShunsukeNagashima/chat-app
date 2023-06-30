import { KyInstance } from 'ky/distribution/types/ky';

import { handleRequest } from '../helper';

import {
  Room,
  CreateRoomRequest,
  FetchAllByUserIDResponse,
  CreateRoomResponse,
} from './entity/room';

import { kyInstance } from '@/lib/ky';

export class RoomClient {
  constructor(private readonly ky: KyInstance) {}

  async fetchAllByUserID(userId: string): Promise<Room[]> {
    const response = await handleRequest(
      this.ky.get(`api/users/${userId}/rooms`).json<FetchAllByUserIDResponse>(),
    );
    return response.result;
  }

  async create(req: CreateRoomRequest): Promise<Room> {
    const response = await handleRequest(
      this.ky.post('api/rooms', { json: req }).json<CreateRoomResponse>(),
    );
    return response.result;
  }
}

export const roomClient = new RoomClient(kyInstance);
