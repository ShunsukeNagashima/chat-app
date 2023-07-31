import { FC } from 'react';

import { BsSendFill } from 'react-icons/bs';
import TextAreaAutosize from 'react-textarea-autosize';

import { Button } from '@/components/ui';

type MessageFormProps = {
  sendMessage: (event: React.SyntheticEvent) => void;
  handleChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  messageContent: string;
  selectedRoomId: string;
  className?: string;
};

export const MessageForm: FC<MessageFormProps> = (props) => {
  const { sendMessage, handleChange, messageContent, selectedRoomId, className } = props;

  return (
    <form
      onSubmit={sendMessage}
      className={`border-t border-gray-700 bg-gray-800 px-6 py-3 ${className}`}
    >
      <div className='flex items-center'>
        <TextAreaAutosize
          value={messageContent}
          onChange={handleChange}
          className='mr-4 w-full rounded border border-gray-700 bg-gray-700 px-4 py-2 text-gray-200 disabled:cursor-not-allowed'
          placeholder='Write your message...'
          disabled={!selectedRoomId}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              sendMessage(e);
            }
          }}
        />
        <Button
          type='submit'
          color='primary'
          disabled={!selectedRoomId || !messageContent}
          startIcon={<BsSendFill size={20} />}
        />
      </div>
    </form>
  );
};
