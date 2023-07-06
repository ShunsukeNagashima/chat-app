import { EventTypesEnum } from '@/lib/enum';

export type RoomUserEvent = {
  type: EventTypesEnum;
  data: {
    roomId: string;
    userId: string;
  };
};
