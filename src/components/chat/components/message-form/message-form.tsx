import { FC } from 'react';

type MessageFormProps = {
  sendMessage: (event: React.FormEvent<HTMLFormElement>) => void;
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
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
        <input
          type='text'
          value={messageContent}
          onChange={handleChange}
          className='mr-4 w-full rounded border border-gray-700 bg-gray-700 px-4 py-2 text-gray-200 disabled:cursor-not-allowed'
          placeholder='Write your message...'
          disabled={!selectedRoomId}
        />
        <button
          type='submit'
          className='rounded bg-indigo-600 px-3 py-2 text-white hover:bg-blue-400 disabled:cursor-not-allowed disabled:bg-blue-500 disabled:opacity-50'
          disabled={!selectedRoomId || !messageContent}
        >
          Send
        </button>
      </div>
    </form>
  );
};
