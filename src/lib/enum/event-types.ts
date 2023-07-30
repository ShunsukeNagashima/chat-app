export const EVENT_TYPES = {
  MESSAGE_SENT: 'MessageSent',
  ROOM_USER_CHANGE: 'RoomUserChange',
} as const;

export type EventTypesEnum = (typeof EVENT_TYPES)[keyof typeof EVENT_TYPES];
