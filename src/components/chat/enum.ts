export const ROOM_CREATION_STEPS = {
  CLOSED: 0,
  CREATE_ROOM: 1,
  CREATE_ROOM_RESULT: 2,
  ADD_USERS: 3,
  ADD_USERS_RESULT: 4,
} as const;

export type RoomCreationSteps = typeof ROOM_CREATION_STEPS;

export type RoomCreationStepsEnum = RoomCreationSteps[keyof RoomCreationSteps];
