import { renderHook, act, waitFor } from '@testing-library/react';
import dayjs from 'dayjs';

import { useChatRooms } from './useChatRooms';

import { User } from '@/domain/models/user';
import { ROOM_TYPE, ROOM_CREATION_STEPS, EVENT_TYPES } from '@/lib/enum';
import { RoomUserEvent } from '@/lib/websocket-event';
import {
  FetchAllByUserIdPayload,
  CreateRoomPayload,
  AddUsersPayload,
} from '@/repository/room/type';
import { SearchUsersPayload } from '@/repository/user/types';
import { useAuthStore } from '@/store/auth-store';
import { useWebSocketStore } from '@/store/websocket-store';

const mocks = {
  fetchAllByUserId: jest.fn(),
  create: jest.fn(),
  setSelectedRoomId: jest.fn(),
  search: jest.fn(),
  addUsers: jest.fn(),
  send: jest.fn(),
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
    search: (payload: SearchUsersPayload) => mocks.search(payload),
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

jest.mock('@/store/chat-store', () => ({
  ...jest.requireActual('@/store/chat-store'),
  useChatStore: () => ({
    setRooms: jest.fn(),
    setSelectedRoomId: mocks.setSelectedRoomId,
    clearMessages: jest.fn(),
  }),
}));

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

jest.mock('@/store/websocket-store');
const mockUseWebSocketStore = useWebSocketStore as jest.MockedFunction<typeof useWebSocketStore>;

jest.mock('@/store/auth-store');
const mockUseAuthStore = useAuthStore as jest.MockedFunction<typeof useAuthStore>;

type Result = {
  current: ReturnType<typeof useChatRooms>;
};

describe('useChatRooms', () => {
  let result: Result;
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseAuthStore.mockImplementation(() => ({
      user: { id: 'testUid' },
    }));
    mockUseWebSocketStore.mockImplementation(() => ({
      wsInstance: {
        send: mocks.send,
      },
    }));
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

      await act(async () => {
        result.current.handleNextStep();
      });

      expect(result.current.currentStep).toBe(ROOM_CREATION_STEPS.CREATE_ROOM);
    });
    it('should decrement the step when handlePrevStep is called', async () => {
      await act(async () => {
        result = renderHook(() => useChatRooms()).result;
      });

      await act(async () => {
        result.current.handleNextStep();
      });

      expect(result.current.currentStep).toBe(ROOM_CREATION_STEPS.CREATE_ROOM);

      await act(async () => {
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
      const mockEvent: RoomUserEvent = {
        type: EVENT_TYPES.USER_JOINED,
        data: {
          userId: 'testUid',
          roomId: mockRoom.id,
        },
      };
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
      expect(mocks.send).toHaveBeenCalledWith(JSON.stringify(mockEvent));
      expect(result.current.currentStep).toEqual(ROOM_CREATION_STEPS.CREATE_ROOM_RESULT);
    });
    it('should do nothing when user is null', async () => {
      mockUseAuthStore.mockImplementation(() => ({
        user: null,
      }));

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
          createdAt: dayjs('2023-01-01'),
          profileImageUrl: 'test-url',
        },
      ];

      mocks.search.mockResolvedValue(mockUsers);

      await act(async () => {
        result = renderHook(() => useChatRooms()).result;
      });

      const event = { target: { value: 'test' } } as any;

      await act(async () => {
        await result.current.searchUsers(event);
      });

      expect(mocks.search).toHaveBeenCalledWith({ from: 0, query: 'test', size: 20 });
      expect(result.current.searchedUsers).toEqual(mockUsers);
    });
  });

  describe('add users', () => {
    it('should add users', async () => {
      const mockUsers: User[] = [
        {
          id: 'testUserId-1',
          name: 'testUser-1',
          email: 'test-1@test.com',
          createdAt: dayjs('2023-01-01'),
          profileImageUrl: 'test-url',
        },
        {
          id: 'testUserId-2',
          name: 'testUser-2',
          email: 'test-2@test.com',
          createdAt: dayjs('2023-01-01'),
          profileImageUrl: 'test-url',
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

      act(() => {
        result.current.addUserToList(mockUsers[0]);
      });
      expect(result.current.usersToBeAdded).toHaveLength(2);

      await act(async () => {
        await result.current.addUsersToRoom(mockRoom);
      });

      await waitFor(() => {
        expect(mocks.addUsers).toHaveBeenCalledWith({
          roomId: mockRoom.id,
          userIds: [mockUsers[1].id, mockUsers[0].id],
        });
      });

      expect(mocks.send).toHaveBeenCalledTimes(mockUsers.length);
      expect(result.current.currentStep).toEqual(currentStepValue + 1);
      expect(result.current.usersToBeAdded).toEqual([]);
    });
  });
});
