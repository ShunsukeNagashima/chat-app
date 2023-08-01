import { RoomTypeEnum } from '@/lib/enum/room-type';

export type ChatRoomFormInput = {
  name: string;
  roomType: RoomTypeEnum;
};
