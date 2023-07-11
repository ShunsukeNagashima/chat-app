import { dataclass } from '@/lib/dataclass';

export type User = {
  readonly id: string;
  readonly name: string;
  readonly email: string;
};

export const UserClass = dataclass<User>().def();
