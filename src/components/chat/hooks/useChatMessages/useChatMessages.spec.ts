import { renderHook, waitFor, act } from '@testing-library/react';
import dayjs from 'dayjs';

import { useChatMessages } from './useChatMessages';

import { messageRepository } from '@/repository/message/message-repository';
import { useChatStore } from '@/store/chat-store';

const mocks = {
  messages: [],
  setSelectedRoomId: jest.fn(),
  setUser: jest.fn(),
  fetchAllByRoomId: jest.fn(),
  batchGet: jest.fn(),
  setMessages: jest.fn().mockImplementation((newMessages: any) => {
    mocks.messages = newMessages;
  }),
};

const setupWebSocketMock = () => {
  const mockWebSocket = {
    send: jest.fn(),
    close: jest.fn(),
  };
  (global as any).WebSocket = jest.fn().mockImplementation(() => mockWebSocket);
  return mockWebSocket;
};

jest.mock('@/repository/message/message-repository', () => ({
  messageRepository: {
    fetchAllByRoomId: (arg: { roomId: string; nextKey: string }) => mocks.fetchAllByRoomId(arg),
    create: jest.fn(),
  },
}));

jest.mock('@/repository/user/user-repository', () => ({
  userRepository: {
    batchGet: () => mocks.batchGet(),
  },
}));

jest.mock('@/store/chat-store', () => {
  const actual = jest.requireActual('@/store/chat-store');
  return {
    ...actual,
    useChatStore: () => ({
      messages: mocks.messages,
      selectedRoomId: mocks.setSelectedRoomId(),
      addMessage: jest.fn(),
      setMessages: mocks.setMessages,
    }),
  };
});

jest.mock('@/hooks/useAuth', () => ({
  useAuth: () => ({
    user: mocks.setUser(),
  }),
}));

jest.mock('@/hooks/useErrorHandler', () => ({
  useErrorHandler: () => ({
    resetError: jest.fn(),
    handleError: jest.fn(),
  }),
}));

jest.mock('ky', () => ({
  create: jest.fn(),
  HTTPError: jest.fn(),
}));

type Result = {
  current: ReturnType<typeof useChatMessages>;
};

const createDefaultResult = (): Result => {
  return {
    current: {
      messageContent: '',
      nextKey: '',
      sendMessage: () => Promise.resolve(),
      handleChange: () => {},
      fetchMoreMessages: () => Promise.resolve(),
    },
  };
};

describe('useChatMessages', () => {
  let result: Result;
  beforeEach(() => {
    jest.clearAllMocks();
    result = createDefaultResult();
  });

  describe('sendMessage', () => {
    it('should do nothing when selectedRoomId is null', async () => {
      mocks.setSelectedRoomId.mockReturnValue(null);

      await act(async () => {
        result = renderHook(() => useChatMessages()).result;
      });

      const event = { preventDefault: jest.fn() } as any;
      await act(async () => {
        result.current.sendMessage(event);
      });

      expect(messageRepository.create).not.toHaveBeenCalled();
    });
    it('should do nothing when user is not authenticated', async () => {
      mocks.setUser.mockReturnValue(null);
      const { result } = renderHook(() => useChatMessages());

      const event = { preventDefault: jest.fn() } as any;
      await act(async () => {
        result.current.sendMessage(event);
      });

      expect(messageRepository.create).not.toHaveBeenCalled();
    });
    it('should change message content', async () => {
      await act(async () => {
        result = renderHook(() => useChatMessages()).result;
      });

      act(() => {
        result.current.handleChange({ target: { value: 'Hello, World' } } as any);
      });

      expect(result.current.messageContent).toBe('Hello, World');
    });
    it('should create message', async () => {
      const ws = setupWebSocketMock();

      mocks.setSelectedRoomId.mockReturnValue('testRoomId');
      mocks.setUser.mockReturnValue({ uid: 'test' });
      mocks.fetchAllByRoomId.mockResolvedValue({
        messages: [],
        nextKey: '',
      });
      mocks.batchGet.mockResolvedValue([]);

      await waitFor(() => {
        result = renderHook(() => useChatMessages()).result;
      });

      act(() => {
        result.current.handleChange({ target: { value: 'Hello, World' } } as any);
      });

      expect(result.current.messageContent).toBe('Hello, World');

      const mockPreventDefault = jest.fn();
      const event = { preventDefault: mockPreventDefault } as any;
      await act(async () => {
        await result.current.sendMessage(event);
      });

      expect(mockPreventDefault).toHaveBeenCalled();
      expect(messageRepository.create).toHaveBeenCalled();
      expect(ws.send).toHaveBeenCalled();
      expect(result.current.messageContent).toBe('');
    });
  });

  describe('fetchMessagesAndUserNames', () => {
    it('should fetch messages and usernames', async () => {
      const messagesWithUserName = [
        {
          id: 'test',
          roomId: 'testRoomId',
          userId: 'testUserId',
          content: 'testContent',
          createdAt: dayjs(new Date(2023, 1, 1)),
          userName: 'testUserName',
        },
      ];

      mocks.fetchAllByRoomId.mockResolvedValue({
        messages: [
          {
            id: 'test',
            roomId: 'testRoomId',
            userId: 'testUserId',
            content: 'testContent',
            createdAt: dayjs(new Date(2023, 1, 1)),
          },
        ],
        nextKey: '',
      });

      mocks.batchGet.mockResolvedValue([
        {
          id: 'testUserId',
          name: 'testUserName',
        },
      ]);

      let result = createDefaultResult();
      await act(async () => {
        result = renderHook(() => useChatMessages()).result;
      });

      const { result: chatStoreResult } = renderHook(() => useChatStore());

      expect(mocks.fetchAllByRoomId).toHaveBeenCalled();
      expect(mocks.batchGet).toHaveBeenCalled();
      expect(mocks.setMessages).toHaveBeenCalledWith(messagesWithUserName);
      expect(chatStoreResult.current.messages).toStrictEqual(messagesWithUserName);
    });
  });

  it('should fetch user data from localStorage', async () => {
    mocks.setSelectedRoomId.mockReturnValue('testRoomId');

    const messagesWithUserName = [
      {
        id: 'test',
        roomId: 'testRoomId',
        userId: 'testUserId',
        content: 'testContent',
        createdAt: dayjs(new Date(2023, 1, 1)),
        userName: 'testUserName',
      },
    ];

    mocks.fetchAllByRoomId.mockResolvedValue({
      messages: [
        {
          id: 'test',
          roomId: 'testRoomId',
          userId: 'testUserId',
          content: 'testContent',
          createdAt: dayjs(new Date(2023, 1, 1)),
        },
      ],
      nextKey: '',
    });

    window.localStorage.setItem(
      'testRoomId',
      JSON.stringify({
        userNameMap: {
          testUserId: 'testUserName',
        },
        timestamp: Date.now(),
      }),
    );

    await waitFor(async () => {
      result = renderHook(() => useChatMessages()).result;
    });

    expect(mocks.setMessages).toHaveBeenCalledWith(messagesWithUserName);
    expect(mocks.batchGet).not.toHaveBeenCalled();
  });
  it('should fetch user data if timestamp is not valid', async () => {
    mocks.setSelectedRoomId.mockReturnValue('testRoomId');

    mocks.fetchAllByRoomId.mockResolvedValue({
      messages: [
        {
          id: 'test',
          roomId: 'testRoomId',
          userId: 'testUserId',
          content: 'testContent',
          createdAt: dayjs(new Date(2023, 1, 1)),
        },
      ],
      nextKey: '',
    });

    window.localStorage.setItem(
      'testRoomId',
      JSON.stringify({
        userNameMap: {
          testUserId: 'testUserName',
        },
        timestamp: Date.now() - 1000 * 60 * 60 * 24,
      }),
    );

    await act(async () => {
      result = renderHook(() => useChatMessages()).result;
    });

    expect(mocks.batchGet).toHaveBeenCalled();
  });
  it('should fetch more messages', async () => {
    mocks.setSelectedRoomId.mockReturnValue('testRoomId');

    mocks.fetchAllByRoomId.mockResolvedValue({
      messages: [
        {
          id: 'test',
          roomId: 'testRoomId',
          userId: 'testUserId',
          content: 'testContent',
          createdAt: dayjs(new Date(2023, 1, 1)),
        },
      ],
      nextKey: 'testNextKey',
    });

    mocks.batchGet.mockResolvedValue([
      {
        id: 'testUserId',
        name: 'testUserName',
      },
    ]);

    await act(async () => {
      result = renderHook(() => useChatMessages()).result;
    });

    await act(async () => {
      await result.current.fetchMoreMessages();
    });

    expect(result.current.nextKey).toBe('testNextKey');
  });
});
