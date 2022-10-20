import React from 'react';
import MessageForm from '../Components/MessageForm';
import Sidebar from '../Components/Sidebar';

const Chat = () => {
  return (
    <div className="container flex gap-10 mt-6 h-[560px]">
      <Sidebar />
      <MessageForm />
    </div>
  );
};

export default Chat;
