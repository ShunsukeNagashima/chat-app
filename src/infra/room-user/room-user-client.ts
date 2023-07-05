import { KyInstance } from 'ky/distribution/types/ky';

import { AddUsersRequest, AddUsersResponse } from './entity/room-user';

import { kyInstance } from '@/lib/ky';

class RoomUserClient {
  constructor(private readonly ky: KyInstance) {}

  async addUsers(req: AddUsersRequest): Promise<string> {
    const response = await this.ky
      .post(`api/rooms/${req.roomId}/users`, { json: { userIds: req.userIds } })
      .json<AddUsersResponse>();
    return response.result;
  }
}

export const roomUserClient = new RoomUserClient(kyInstance);
