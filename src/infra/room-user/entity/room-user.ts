export type RoomUser = {
  roomId: string;
  userId: string;
};

export type AddUsersRequest = {
  roomId: string;
  userIds: string[];
};

export type AddUsersResponse = {
  result: string;
};
