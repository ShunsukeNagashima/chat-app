import { UserRepositoryImpl } from './user-repository';

import { userClient } from '@/infra/user/user-client';
import { proxy } from '@/utils/proxy';

describe('UserRepository', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  let mockClient = proxy(userClient, {
    fetchById: jest.fn(),
    create: jest.fn(),
    batchGet: jest.fn(),
  });

  it('should fetch user correctly', async () => {
    const client = proxy(mockClient, {
      fetchById: jest.fn().mockResolvedValue({
        userId: 'test-user-id',
        userName: 'test-user-name',
        email: 'test-email@test.com',
      }),
    });

    const userRepository = new UserRepositoryImpl(client);

    const user = await userRepository.fetchById({ userId: 'test-user-id' });

    expect(user.id).toEqual('test-user-id');
    expect(user.name).toEqual('test-user-name');
    expect(user.email).toEqual('test-email@test.com');
  });

  it('should create user correctly', async () => {
    const client = proxy(mockClient, {
      create: jest.fn().mockResolvedValue({
        userId: 'test-user-id',
        userName: 'test-user-name',
        email: 'test-email@test.com',
      }),
    });

    const userRepository = new UserRepositoryImpl(client);

    const user = await userRepository.create({
      userId: 'test-user-id',
      name: 'test-user-name',
      email: 'test-email@test.com',
      idToken: 'test-token',
    });

    expect(user.id).toEqual('test-user-id');
    expect(user.name).toEqual('test-user-name');
    expect(user.email).toEqual('test-email@test.com');
  });

  it('should batch get users correctly', async () => {
    const mockUsers = [];
    for (let i = 0; i < 3; i++) {
      mockUsers.push({
        userId: `test-user-id-${i}`,
        userName: `test-user-name-${i}`,
        email: `user-${i}@test.com`,
      });
    }

    const client = proxy(mockClient, {
      batchGet: jest.fn().mockResolvedValue([
        {
          userId: 'test-user-id-1',
          userName: 'test-user-name-1',
          email: 'user-1@test.com',
        },
        {
          userId: 'test-user-id-2',
          userName: 'test-user-name-2',
          email: 'user-2@test.com',
        },
      ]),
    });

    const userRepository = new UserRepositoryImpl(client);

    const users = await userRepository.batchGet({
      userIds: ['test-user-id-1', 'test-user-id-2'],
    });

    expect(users.length).toEqual(2);
    expect(users[0].id).toEqual('test-user-id-1');
    expect(users[0].name).toEqual('test-user-name-1');
    expect(users[0].email).toEqual('user-1@test.com');
    expect(users[1].id).toEqual('test-user-id-2');
    expect(users[1].name).toEqual('test-user-name-2');
    expect(users[1].email).toEqual('user-2@test.com');
  });
});
