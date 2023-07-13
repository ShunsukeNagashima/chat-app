export type CreateUserPayload = {
  userId: string;
  name: string;
  email: string;
  idToken: string;
};

export type FetchByIdPayload = {
  userId: string;
};

export type SearchUsersPayload = {
  query: string;
  from: number;
  size: number;
};

export type BatchGetUsersPayload = {
  userIds: string[];
};
