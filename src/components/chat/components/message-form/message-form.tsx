import { FC } from 'react';

type MessageFormProps = {
  sendMessage: (event: React.FormEvent<HTMLFormElement>) => void;
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  messageContent: string;
  className?: string;
};

export const MessageForm: FC<MessageFormProps> = (props) => {
  const { sendMessage, handleChange, messageContent, className } = props;

  return (
    <form
      onSubmit={sendMessage}
      className={`px-6 py-3 bg-gray-800 border-t border-gray-700 ${className}`}
    >
      <div className='flex items-center'>
        <input
          type='text'
          value={messageContent}
          onChange={handleChange}
          className='w-full px-4 py-2 mr-4 text-gray-200 bg-gray-700 border border-gray-700 rounded'
          placeholder='Write your message...'
        />
        <button
          type='submit'
          className='px-3 py-2 text-white bg-blue-500 rounded hover:bg-blue-400'
        >
          Send
        </button>
      </div>
    </form>
  );
};
