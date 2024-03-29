import { FC } from 'react';

import InfineteScroll from 'react-infinite-scroll-component';

import { MessageItem } from './components/message-item';

import { Spinner } from '@/components/ui';
import { Message } from '@/domain/models/message';

type MessageListProps = {
  messages: Message[];
  selectedRoomId: string;
  nextKey: string;
  fetchMoreMessages: () => Promise<void>;
  className?: string;
};

export const MessageList: FC<MessageListProps> = (props) => {
  const { messages, selectedRoomId, nextKey, fetchMoreMessages, className } = props;

  if (!selectedRoomId) {
    return (
      <div className='flex h-full items-center justify-center text-center text-lg text-gray-400'>
        No chat room is selected. <br />
        Please select one from the sidebar or create a new chat room.
      </div>
    );
  }

  return (
    <div
      className={`flex flex-1 flex-col-reverse overflow-y-auto px-6 py-4 ${className}`}
      id='scrollableDiv'
    >
      <InfineteScroll
        dataLength={messages.length}
        next={fetchMoreMessages}
        inverse={true}
        hasMore={!!nextKey}
        loader={<Spinner />}
        style={{ display: 'flex', flexDirection: 'column-reverse' }}
        endMessage={<p className='text-center font-bold'>No more messages</p>}
        scrollableTarget='scrollableDiv'
      >
        {messages.map((message, i) => (
          <MessageItem key={i} message={message} />
        ))}
      </InfineteScroll>
    </div>
  );
};
