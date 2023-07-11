export type CreateMessagePayload = {
  roomId: string;
  userId: string;
  content: string;
};

export type FetchAllByRoomIdPayload = {
  roomId: string;
};

export type UpdateMessagePayload = {
  roomId: string;
  messageId: string;
  content: string;
};

export type DeleteMessagePayload = {
  roomId: string;
  messageId: string;
};
