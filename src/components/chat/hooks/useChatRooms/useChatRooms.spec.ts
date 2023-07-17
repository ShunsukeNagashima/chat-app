import { renderHook, act, waitFor } from '@testing-library/react';

import { useChatRooms } from './useChatRooms';

import { ROOM_TYPE, ROOM_CREATION_STEPS } from '@/lib/enum';
import {
  FetchAllByUserIdPayload,
  CreateRoomPayload,
  AddUsersPayload,
} from '@/repository/room/type';
import { SearchUsersPayload } from '@/repository/user/types';

const mocks = {
  selectedRoomId: '',
  fetchAllByUserId: jest.fn(),
  create: jest.fn(),
  setUser: jest.fn(),
  setSelectedRoomId: jest.fn().mockImplementation((roomId: string) => {
    mocks.selectedRoomId = roomId;
  }),
  searchUsers: jest.fn(),
  addUsers: jest.fn(),
};

const setupWebSocketMock = () => {
  const mockWebSocket = {
    send: jest.fn(),
    close: jest.fn(),
    onmessage: jest.fn(),
  };
  (global as any).WebSocket = jest.fn().mockImplementation(() => mockWebSocket);
  return mockWebSocket;
};

jest.mock('@/repository/room/room-repository', () => ({
  roomRepository: {
    fetchAllByUserId: (payload: FetchAllByUserIdPayload) => mocks.fetchAllByUserId(payload),
    create: (payload: CreateRoomPayload) => mocks.create(payload),
    addUsers: (payload: AddUsersPayload) => mocks.addUsers(payload),
  },
}));

jest.mock('@/repository/user/user-repository', () => ({
  userRepository: {
    search: (payload: SearchUsersPayload) => mocks.searchUsers(payload),
  },
}));

jest.mock('firebase/auth', () => {
  let callback: (arg: any) => void;
  return {
    getAuth: jest.fn(),
    onAuthStateChanged: jest.fn((_, cb) => {
      callback = cb;
      return () => {};
    }),
    triggerAuthChange: (user: any) => {
      callback(user);
    },
  };
});

jest.mock('ky', () => ({
  create: jest.fn(),
  HTTPError: jest.fn(),
}));

jest.mock('@/store/chat-store', () => {
  const actual = jest.requireActual('@/store/chat-store');
  return {
    ...actual,
    useChatStore: () => ({
      selectedRoomId: mocks.selectedRoomId,
      setRooms: jest.fn(),
      setSelectedRoomId: mocks.setSelectedRoomId,
      clearMessages: jest.fn(),
    }),
  };
});

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

jest.mock('@/store/websocket-store', () => {
  const actual = jest.requireActual('@/store/websocket-store');
  return {
    ...actual,
    useWebSocketStore: () => ({
      wsInstance: null,
      setWebsocketInstance: jest.fn,
    }),
  };
});

jest.mock('@/hooks/useAuth', () => ({
  useAuth: () => ({
    user: mocks.setUser(),
  }),
}));

type Result = {
  current: ReturnType<typeof useChatRooms>;
};

describe('useChatRooms', () => {
  let result: Result;
  beforeEach(() => {
    jest.clearAllMocks();
  });
  describe('fetch rooms', () => {
    it('should fetch rooms', async () => {
      const mockRooms = [
        {
          id: 'testRoomId',
          name: 'testRoom',
          roomType: ROOM_TYPE.PUBLIC,
        },
      ];
      mocks.setUser.mockReturnValue({ uid: 'testUid' });
      mocks.fetchAllByUserId.mockResolvedValue(mockRooms);

      await act(async () => {
        result = renderHook(() => useChatRooms()).result;
      });

      expect(mocks.fetchAllByUserId).toHaveBeenCalledWith({ userId: 'testUid' });
      expect(result.current.rooms).toStrictEqual(mockRooms);
    });
  });
  describe('step change', () => {
    it('should increment the step when handleNextStep is called', async () => {
      await act(async () => {
        result = renderHook(() => useChatRooms()).result;
      });

      act(() => {
        result.current.handleNextStep();
      });

      expect(result.current.currentStep).toBe(ROOM_CREATION_STEPS.CREATE_ROOM);
    });
    it('should decrement the step when handlePrevStep is called', async () => {
      await act(async () => {
        result = renderHook(() => useChatRooms()).result;
      });

      act(() => {
        result.current.handleNextStep();
      });

      expect(result.current.currentStep).toBe(ROOM_CREATION_STEPS.CREATE_ROOM);

      act(() => {
        result.current.handlePrevStep();
      });

      expect(result.current.currentStep).toBe(ROOM_CREATION_STEPS.CLOSED);
    });
  });
  describe('create room', () => {
    it('should create room', async () => {
      const mockRoom = {
        id: 'testRoomId',
        name: 'testRoom',
        roomType: ROOM_TYPE.PUBLIC,
      };
      mocks.setUser.mockReturnValue({ uid: 'testUid' });
      mocks.create.mockResolvedValue(mockRoom);

      await act(async () => {
        result = renderHook(() => useChatRooms()).result;
      });

      act(() => {
        result.current.handleNextStep();
      });

      const formData = { name: 'test-name', roomType: ROOM_TYPE.PUBLIC };

      await act(async () => {
        await result.current.createRoom(formData);
      });

      expect(result.current.createdRoom).toEqual(mockRoom);
      expect(mocks.create).toHaveBeenCalledWith({
        name: formData.name,
        roomType: formData.roomType,
        ownerId: 'testUid',
      });

      expect(result.current.currentStep).toEqual(ROOM_CREATION_STEPS.CREATE_ROOM_RESULT);
    });
    it('should do nothing when user is null', async () => {
      mocks.setUser.mockReturnValue(null);

      await act(async () => {
        result = renderHook(() => useChatRooms()).result;
      });

      const formData = { name: 'test-name', roomType: ROOM_TYPE.PUBLIC };

      await act(async () => {
        await result.current.createRoom(formData);
      });

      expect(mocks.create).not.toHaveBeenCalled();
    });
  });
  describe('select room', () => {
    it('should select room', async () => {
      await act(async () => {
        result = renderHook(() => useChatRooms()).result;
      });

      await act(async () => {
        result.current.selectRoom('testRoomId');
      });

      expect(mocks.setSelectedRoomId).toHaveBeenCalledWith('testRoomId');
    });
  });
  describe('search users', () => {
    it('should search users', async () => {
      const mockUsers = [
        {
          id: 'testUserId',
          name: 'testUser',
          email: 'test@test.com',
        },
      ];
      mocks.searchUsers.mockResolvedValue(mockUsers);

      await act(async () => {
        result = renderHook(() => useChatRooms()).result;
      });

      const event = { target: { value: 'test' } } as any;

      await act(async () => {
        await result.current.searchUsers(event);
      });

      expect(result.current.searchedUsers).toEqual(mockUsers);
    });
  });

  describe('add users', () => {
    it('should add users', async () => {
      const mockUsers = [
        {
          id: 'testUserId-1',
          name: 'testUser-1',
          email: 'test-1@test.com',
        },
        {
          id: 'testUserId-2',
          name: 'testUser-2',
          email: 'test-2@test.com',
        },
      ];

      const mockRoom = {
        id: 'testRoomId',
        name: 'testRoom',
        roomType: ROOM_TYPE.PUBLIC,
      };

      mocks.addUsers.mockResolvedValue({});

      await act(async () => {
        result = renderHook(() => useChatRooms()).result;
      });

      const currentStepValue = result.current.currentStep;

      act(() => {
        result.current.addUserToList(mockUsers[0]);
      });
      expect(result.current.usersToBeAdded).toHaveLength(1);

      act(() => {
        result.current.removeUserFromList(mockUsers[0].id);
      });
      expect(result.current.usersToBeAdded).toHaveLength(0);

      act(() => {
        result.current.addUserToList(mockUsers[1]);
      });
      expect(result.current.usersToBeAdded).toHaveLength(1);

      await act(async () => {
        await result.current.addUsersToRoom(mockRoom);
      });

      await waitFor(() => {
        expect(mocks.addUsers).toHaveBeenCalledWith({
          roomId: mockRoom.id,
          userIds: [mockUsers[1].id],
        });
      });

      expect(result.current.currentStep).toEqual(currentStepValue + 1);
      expect(result.current.usersToBeAdded).toEqual([]);
    });
  });
});