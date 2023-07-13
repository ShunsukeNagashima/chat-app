// Entity
export type Message = {
  messageId: string;
  userId: string;
  roomId: string;
  content: string;
  createdAt: Date;
};

// Requests
export type CreateMessageRequest = {
  userId: string;
  content: string;
};

// Resonses
export type CreateMessageResponse = {
  result: Message;
};

export type FetchAllByRoomIdResponse = {
  result: Message[];
  nextKey: string;
};
