import { renderHook, act } from '@testing-library/react';
import dayjs from 'dayjs';

import { useChatMessages } from './useChatMessages';

import { ROOM_TYPE } from '@/lib/enum';
import { messageRepository } from '@/repository/message/message-repository';
import { FetchAllByRoomIdPayload } from '@/repository/message/types';
import { useAuthStore } from '@/store/auth-store';

const mocks = {
  messages: [],
  setSelectedRoom: jest.fn(),
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
    fetchAllByRoomId: (payload: FetchAllByRoomIdPayload) => mocks.fetchAllByRoomId(payload),
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
      selectedRoom: mocks.setSelectedRoom(),
      addMessage: jest.fn(),
      setMessages: mocks.setMessages,
    }),
  };
});

jest.mock('@/store/auth-store');
const mockUseAuthStore = useAuthStore as jest.MockedFunction<typeof useAuthStore>;

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

describe('useChatMessages', () => {
  let result: Result;
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('sendMessage', () => {
    it('should do nothing when selectedRoom is null', async () => {
      mocks.setSelectedRoom.mockReturnValue(null);
      mockUseAuthStore.mockImplementation(() => ({
        user: null,
      }));

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
      mockUseAuthStore.mockImplementation(() => ({
        user: null,
      }));

      await act(async () => {
        result = renderHook(() => useChatMessages()).result;
      });

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
      const mockRoom = {
        id: 'testRoomId',
        name: 'testRoom',
        roomType: ROOM_TYPE.PUBLIC,
      };

      mocks.setSelectedRoom.mockReturnValue(mockRoom);
      mockUseAuthStore.mockImplementation(() => ({
        user: { id: 'testUserId' },
      }));
      mocks.fetchAllByRoomId.mockResolvedValue({
        messages: [],
        nextKey: '',
      });
      mocks.batchGet.mockResolvedValue([]);

      await act(async () => {
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
      mockUseAuthStore.mockImplementation(() => ({
        user: { id: 'testUserId' },
      }));

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

      await act(async () => {
        result = renderHook(() => useChatMessages()).result;
      });

      expect(mocks.fetchAllByRoomId).toHaveBeenCalled();
      expect(mocks.batchGet).toHaveBeenCalled();
      expect(mocks.setMessages).toHaveBeenCalledWith(messagesWithUserName);
    });
  });

  it('should fetch user data from localStorage', async () => {
    const mockRoom = {
      id: 'testRoomId',
      name: 'testRoom',
      roomType: ROOM_TYPE.PUBLIC,
    };
    mocks.setSelectedRoom.mockReturnValue(mockRoom);
    mockUseAuthStore.mockImplementation(() => ({
      user: { id: 'testUserId' },
    }));

    const messagesWithUserName = [
      {
        id: 'test',
        roomId: 'testRoomId',
        userId: 'testUserId',
        content: 'testContent',
        createdAt: dayjs(new Date(2023, 1, 1)),
        userName: 'testUserName',
        userImageUrl: 'testUserImageUrl',
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
        userMap: {
          testUserId: { name: 'testUserName', imageUrl: 'testUserImageUrl' },
        },
        timestamp: Date.now(),
      }),
    );

    await act(async () => {
      result = renderHook(() => useChatMessages()).result;
    });

    expect(mocks.setMessages).toHaveBeenCalledWith(messagesWithUserName);
    expect(mocks.batchGet).not.toHaveBeenCalled();
  });
  it('should fetch user data if timestamp is not valid', async () => {
    const mockRoom = {
      id: 'testRoomId',
      name: 'testRoom',
      roomType: ROOM_TYPE.PUBLIC,
    };
    mocks.setSelectedRoom.mockReturnValue(mockRoom);

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
    const mockRoom = {
      id: 'testRoomId',
      name: 'testRoom',
      roomType: ROOM_TYPE.PUBLIC,
    };
    mocks.setSelectedRoom.mockReturnValue(mockRoom);

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
