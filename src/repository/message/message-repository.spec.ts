import dayjs from 'dayjs';

import { MessageRepositoryImpl } from './message-repository';

import { messageClient } from '@/infra/message/message-client';
import { proxy } from '@/utils/proxy';

describe('MessageRepository', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  let mockClient = proxy(messageClient, {
    create: jest.fn(),
    fetchAllByRoomId: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  });

  it('should create message correctly', async () => {
    const client = proxy(mockClient, {
      create: jest.fn().mockResolvedValue({
        messageId: 'test-message-id',
        roomId: 'test-room-id',
        userId: 'test-user-id',
        content: 'test-content',
        createdAt: dayjs('2023-01-01'),
      }),
    });

    const messageRepository = new MessageRepositoryImpl(client);

    const message = await messageRepository.create({
      roomId: 'test-room-id',
      userId: 'test-user-id',
      content: 'test-content',
    });

    expect(message.id).toEqual('test-message-id');
    expect(message.roomId).toEqual('test-room-id');
    expect(message.userId).toEqual('test-user-id');
    expect(message.content).toEqual('test-content');
    expect(message.createdAt.format('YYYY-MM-DD')).toEqual('2023-01-01');
  });

  it('should fetch messages correctly', async () => {
    let messages = [];
    for (let i = 0; i < 3; i++) {
      messages.push({
        messageId: `test-message-id-${i}`,
        roomId: `test-room-id`,
        userId: `test-user-id`,
        content: `test-content-${i}`,
        createdAt: new Date(`2023-01-0${i + 1}`),
      });
    }

    const clinet = proxy(mockClient, {
      fetchAllByRoomId: jest
        .fn()
        .mockResolvedValue({ messages: messages, nextKey: 'test-next-key' }),
    });

    const messageRepository = new MessageRepositoryImpl(clinet);

    const res = await messageRepository.fetchAllByRoomId({ roomId: 'test-roomId', nextKey: '' });

    expect(res.messages.length).toEqual(messages.length);
    expect(res.messages[0].id).toEqual('test-message-id-0');
    expect(res.messages[0].roomId).toEqual('test-room-id');
    expect(res.messages[0].userId).toEqual('test-user-id');
    expect(res.messages[0].content).toEqual('test-content-0');
    expect(res.messages[0].createdAt).toEqual(dayjs(new Date('2023-01-01')));
    expect(res.nextKey).toEqual('test-next-key');
  });
});
