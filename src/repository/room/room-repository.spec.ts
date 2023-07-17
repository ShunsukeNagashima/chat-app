import { RoomRepositoryImpl } from './room-repository';

import { roomClient } from '@/infra/room/room-client';
import { ROOM_TYPE } from '@/lib/enum';
import { proxy } from '@/utils/proxy';

describe('RoomRepository', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  let mockClient = proxy(roomClient, {
    fetchAllByUserId: jest.fn(),
    create: jest.fn(),
    addUsers: jest.fn(),
  });

  it('should fetch rooms correctly', async () => {
    const client = proxy(mockClient, {
      fetchAllByUserId: jest.fn().mockResolvedValue([
        {
          roomId: 'test-room-id',
          name: 'test-room-name',
          roomType: ROOM_TYPE.PUBLIC,
        },
      ]),
    });

    const roomRepository = new RoomRepositoryImpl(client);

    const rooms = await roomRepository.fetchAllByUserId({ userId: 'test-user-id' });

    expect(rooms[0].id).toEqual('test-room-id');
    expect(rooms[0].name).toEqual('test-room-name');
    expect(rooms[0].roomType).toEqual(ROOM_TYPE.PUBLIC);
  });

  it('should create room correctly', async () => {
    const client = proxy(mockClient, {
      create: jest.fn().mockResolvedValue({
        roomId: 'test-room-id',
        name: 'test-room-name',
        roomType: ROOM_TYPE.PUBLIC,
      }),
    });

    const roomRepository = new RoomRepositoryImpl(client);

    const room = await roomRepository.create({
      name: 'test-room-name',
      roomType: ROOM_TYPE.PUBLIC,
      ownerId: 'test-user-id',
    });

    expect(room.id).toEqual('test-room-id');
    expect(room.name).toEqual('test-room-name');
    expect(room.roomType).toEqual(ROOM_TYPE.PUBLIC);
  });

  it('should add users correctly', async () => {
    const client = proxy(mockClient, {
      addUsers: jest.fn().mockResolvedValue(undefined),
    });

    const roomRepository = new RoomRepositoryImpl(client);

    await roomRepository.addUsers({
      roomId: 'test-room-id',
      userIds: ['test-user-id'],
    });

    expect(client.addUsers).toHaveBeenCalledWith('test-room-id', { userIds: ['test-user-id'] });
  });
});
