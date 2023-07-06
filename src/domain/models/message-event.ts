import { Message } from './message';

import { EventTypesEnum } from '@/lib/enum';

export type MessageEvent = {
  type: EventTypesEnum;
  data: Message;
};
