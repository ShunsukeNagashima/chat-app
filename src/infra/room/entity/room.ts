import { RoomTypeEnum } from '@/lib/enum/room-type';

// Entity
export type Room = {
  roomId: string;
  name: string;
  roomType: RoomTypeEnum;
};

// Requests
export type CreateRoomRequest = {
  name: string;
  roomType: RoomTypeEnum;
  ownerId: string;
};

export type AddUsersRequest = {
  userIds: string[];
};

// Repsonses
export type CreateRoomResponse = {
  result: Room;
};

export type FetchAllByUserIDResponse = {
  result: Room[];
};

export type AddUsersResponse = {
  result: string;
};

export type RemoveUserResponse = {
  result: string;
};
