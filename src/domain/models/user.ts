import { Dayjs } from 'dayjs';

import { dataclass } from '@/lib/dataclass';

export type User = {
  readonly id: string;
  readonly name: string;
  readonly email: string;
  readonly profileImageUrl: string;
  readonly createdAt: Dayjs;
};

export const UserClass = dataclass<User>().def();
