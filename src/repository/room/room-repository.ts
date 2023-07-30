import {
  CreateRoomPayload,
  FetchAllByUserIdPayload,
  AddUsersPayload,
  RemoveUserPayload,
} from './type';

import { Room } from '@/domain/models/room';
import { RoomClass } from '@/domain/models/room';
import { RoomClient, roomClient } from '@/infra/room/room-client';

export interface RoomRepository {
  create(payload: CreateRoomPayload): Promise<Room>;
  fetchAllByUserId: (payload: FetchAllByUserIdPayload) => Promise<Room[]>;
  addUsers: (payload: AddUsersPayload) => Promise<void>;
  removeUser: (payload: RemoveUserPayload) => Promise<void>;
}

export class RoomRepositoryImpl implements RoomRepository {
  constructor(private readonly roomClient: RoomClient) {}

  async create(payload: CreateRoomPayload): Promise<Room> {
    const room = await this.roomClient.create(payload);

    return RoomClass.create({
      id: room.roomId,
      name: room.name,
      roomType: room.roomType,
    });
  }

  async fetchAllByUserId(payload: FetchAllByUserIdPayload): Promise<Room[]> {
    const { userId } = payload;

    const rooms = await this.roomClient.fetchAllByUserId(userId);

    return rooms.map((room) => {
      return RoomClass.create({
        id: room.roomId,
        name: room.name,
        roomType: room.roomType,
      });
    });
  }

  async addUsers(payload: AddUsersPayload): Promise<void> {
    const { roomId, ...rest } = payload;

    await this.roomClient.addUsers(roomId, rest);
  }

  async removeUser(payload: RemoveUserPayload): Promise<void> {
    const { roomId, userId } = payload;

    await this.roomClient.removeUser(roomId, userId);
  }
}

export const roomRepository = new RoomRepositoryImpl(roomClient);
