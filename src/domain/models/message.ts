import { Dayjs } from 'dayjs';

import { dataclass } from '@/lib/dataclass';

export type Message = {
  readonly id: string;
  readonly userId: string;
  readonly userName: string;
  readonly roomId: string;
  readonly content: string;
  readonly createdAt: Dayjs;
};

export const MessageClass = dataclass<Message>().def();
