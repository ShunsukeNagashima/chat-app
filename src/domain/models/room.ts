import { Dayjs } from 'dayjs';

import { dataclass } from '@/lib/dataclass';
import { RoomTypeEnum } from '@/lib/enum';

export type Room = {
  readonly id: string;
  readonly name: string;
  readonly roomType: RoomTypeEnum;
  readonly createdAt: Dayjs;
};

export const RoomClass = dataclass<Room>().def();
