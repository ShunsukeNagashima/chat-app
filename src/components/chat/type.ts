import { RoomTypeEnum } from '@/infra/room/entity/room';

export type ChatRoomFormInput = {
  name: string;
  roomType: RoomTypeEnum;
};
