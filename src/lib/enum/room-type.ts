export const ROOM_TYPE = {
  PUBLIC: 'public',
  PRIVATE: 'private',
} as const;

export type RoomTypeEnum = (typeof ROOM_TYPE)[keyof typeof ROOM_TYPE];
