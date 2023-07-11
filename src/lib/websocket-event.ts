import { Message } from '@/domain/models/message';
import { EventTypesEnum } from '@/lib/enum';

export type RoomUserEvent = {
  type: EventTypesEnum;
  data: {
    roomId: string;
    userId: string;
  };
};

export type MessageEvent = {
  type: EventTypesEnum;
  data: Message;
};
