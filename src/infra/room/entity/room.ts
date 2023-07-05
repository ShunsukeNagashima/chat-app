export type Room = {
  roomId: string;
  name: string;
  roomType: RoomTypeEnum;
};

export const roomType = {
  public: 'public',
  private: 'private',
};

export type RoomTypeEnum = keyof typeof roomType;

export type FetchAllByUserIDResponse = {
  result: Room[];
};

export type CreateRoomRequest = {
  name: string;
  roomType: RoomTypeEnum;
  ownerId: string;
};

export type CreateRoomResponse = {
  result: Room;
};
