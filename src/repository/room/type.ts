import { RoomTypeEnum } from '@/lib/enum/room-type';

export type CreateRoomPayload = {
  name: string;
  roomType: RoomTypeEnum;
  ownerId: string;
};

export type FetchAllByUserIdPayload = {
  userId: string;
};

export type AddUsersPayload = {
  roomId: string;
  userIds: string[];
};

export type RemoveUserPayload = {
  roomId: string;
  userId: string;
};
