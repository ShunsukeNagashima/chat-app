export const EVENT_TYPES = {
  MESSAGE: 'message',
  ROOM_EVENT: 'room_event',
} as const;

export type EventTypesEnum = (typeof EVENT_TYPES)[keyof typeof EVENT_TYPES];
