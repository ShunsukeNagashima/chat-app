import { KyInstance } from 'ky/distribution/types/ky';

import {
  FetchAllByRoomIdResponse,
  Message,
  CreateMessageRequest,
  CreateMessageResponse,
} from './entity/message';

import { kyInstance } from '@/lib/ky';

class MessageClient {
  constructor(private readonly ky: KyInstance) {}

  async fetchAllByRoomId(roomId: string): Promise<{ messages: Message[]; nextKey: string }> {
    const response = await this.ky
      .get(`api/rooms/${roomId}/messages`)
      .json<FetchAllByRoomIdResponse>();
    return { messages: response.result, nextKey: response.nextKey };
  }

  async create(roomId: string, req: CreateMessageRequest): Promise<Message> {
    console.log(req);
    const response = await this.ky
      .post(`api/rooms/${roomId}/messages`, { json: req })
      .json<CreateMessageResponse>();
    return response.result;
  }

  async delete(roomId: string, messageId: string): Promise<void> {
    await this.ky.delete(`api/rooms/${roomId}/messages/${messageId}`);
  }

  async update(roomId: string, messageId: string, content: string): Promise<void> {
    const response = await this.ky.put(`api/rooms/${roomId}/messages/${messageId}`, {
      json: { content },
    });
  }
}

export const messageClient = new MessageClient(kyInstance);
