export type User = {
  userId: string;
  userName: string;
  email: string;
  imageUrl: string;
  createdAt: Date;
};

export type CreateUserRequest = {
  userId: string;
  name: string;
  email: string;
  idToken: string;
};

export type CreateUserResponse = {
  result: User;
};

export type FetchByIdResponse = {
  result: User;
};

export type FetchMultipleUsersResponse = {
  result: User[];
  nextKey: string;
};

export type BatchGetUsersRequest = {
  userIds: string[];
};

export type BatchGetUsersReponse = {
  result: User[];
};
