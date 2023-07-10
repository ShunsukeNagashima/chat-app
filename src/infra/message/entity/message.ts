export type Message = {
  messageId: string;
  userId: string;
  roomId: string;
  content: string;
  createdAt: Date;
};

export type FetchAllByRoomIdRequest = {
  roomId: string;
};

export type FetchAllByRoomIdResponse = {
  result: Message[];
  nextKey: string;
};

export type CreateMessageRequest = {
  userId: string;
  content: string;
};

export type CreateMessageResponse = {
  result: Message;
};
