import dayjs from 'dayjs';

import {
  CreateMessagePayload,
  FetchAllByRoomIdPayload,
  UpdateMessagePayload,
  DeleteMessagePayload,
} from './types';

import { Message, MessageClass } from '@/domain/models/message';
import { MessageClient, messageClient } from '@/infra/message/message-client';

export interface MessageRepository {
  create(payload: CreateMessagePayload): Promise<Message>;
  fetchAllByRoomId(
    payload: FetchAllByRoomIdPayload,
  ): Promise<{ messages: Message[]; nextKey: string }>;
  update(payload: UpdateMessagePayload): Promise<void>;
  delete(payload: DeleteMessagePayload): Promise<void>;
}

export class MessageRepositoryImpl implements MessageRepository {
  constructor(private readonly messageClient: MessageClient) {}

  async create(payload: CreateMessagePayload): Promise<Message> {
    const { roomId, ...rest } = payload;

    const res = await this.messageClient.create(roomId, rest);

    return MessageClass.create({
      id: res.messageId,
      roomId: res.roomId,
      userId: res.userId,
      content: res.content,
      createdAt: dayjs(res.createdAt),
    });
  }

  async fetchAllByRoomId(
    payload: FetchAllByRoomIdPayload,
  ): Promise<{ messages: Message[]; nextKey: string }> {
    const { roomId } = payload;

    const res = await this.messageClient.fetchAllByRoomId(roomId);

    const messages = res.messages.map((message) => {
      return MessageClass.create({
        id: message.messageId,
        userId: message.userId,
        content: message.content,
        createdAt: dayjs(message.createdAt),
      });
    });

    return { messages: messages.reverse(), nextKey: res.nextKey };
  }

  async update(payload: UpdateMessagePayload): Promise<void> {
    const { roomId, messageId, content } = payload;

    await this.messageClient.update(roomId, messageId, content);
  }

  async delete(payload: DeleteMessagePayload): Promise<void> {
    const { roomId, messageId } = payload;

    await this.messageClient.delete(roomId, messageId);
  }
}

export const messageRepository = new MessageRepositoryImpl(messageClient);
