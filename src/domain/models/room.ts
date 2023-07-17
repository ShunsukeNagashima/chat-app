import { dataclass } from '@/lib/dataclass';
import { RoomTypeEnum } from '@/lib/enum';

export type Room = {
  readonly id: string;
  readonly name: string;
  readonly roomType: RoomTypeEnum;
};

export const RoomClass = dataclass<Room>().def();
