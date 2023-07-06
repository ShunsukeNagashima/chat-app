export const EVENT_TYPES = {
  MESSAGE_SENT: 'MessageSent',
  USER_JOINED: 'UserJoined',
} as const;

export type EventTypesEnum = (typeof EVENT_TYPES)[keyof typeof EVENT_TYPES];
