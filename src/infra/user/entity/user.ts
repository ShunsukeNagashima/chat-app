export type User = {
  userId: string;
  username: string;
  email: string;
};

export type CreateUserRequest = {
  userId: string;
  name: string;
  email: string;
  idToken: string;
};
