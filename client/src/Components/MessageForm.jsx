import React, { useContext, useRef, useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { FaTelegramPlane } from 'react-icons/fa';
import { AppContext } from '../context/appContext';

const MessageForm = () => {
  const [message, setMessage] = useState('');
  const user = useSelector((state) => state.user);
  const { socket, currentRoom, setMessages, messages, privateMemberMsg } =
    useContext(AppContext);
  const messageEndRef = useRef();

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  function getFormattedDate() {
    const date = new Date();
    const year = date.getFullYear();
    let month = (1 + date.getMonth()).toString();

    month = month.length > 1 ? month : '0' + month;
    let day = date.getDate().toString();

    day = day.length > 1 ? day : '0' + day;

    return month + '/' + day + '/' + year;
  }

  const todayDate = getFormattedDate();

  socket.off('room-messages').on('room-messages', (roomMessages) => {
    console.log('room messages', roomMessages);
    setMessages(roomMessages);
  });

  const scrollToBottom = () => {
    messageEndRef.current.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!message) return;
    const today = new Date();
    const minutes =
      today.getMinutes() < 10 ? '0' + today.getMinutes() : today.getMinutes();
    const time = today.getHours() + ':' + minutes;
    const roomId = currentRoom;
    socket.emit('message-room', roomId, message, user, time, todayDate);
    setMessage('');
  };

  return (
    <div className="flex-1 flex flex-col bg-white rounded-xl">
      {user && privateMemberMsg?._id && (
        <div className="border-b py-2 px-4 mb-3 flex gap-3 items-center">
          <div className="w-7 h-7 rounded-full overflow-hidden">
            <img
              src={
                privateMemberMsg.picture ||
                'https://scai.kibu.ac.ke/wp-content/uploads/2021/10/NoProfile.png'
              }
              alt=""
              className="w-full h-full object-cover"
            />
          </div>
          <p>{privateMemberMsg.name}</p>
        </div>
      )}
      <div className="flex-1 scrollbar overflow-y-scroll px-3 mt-4">
        {user &&
          messages.map(({ _id: date, messagesByDate }, idx) => (
            <div key={idx}>
              <p className="text-center text-xs text-gray-400">{date}</p>
              {messagesByDate?.map(
                ({ content, time, from: sender }, msgIdx) => (
                  <div
                    key={msgIdx}
                    className={`flex gap-2 py-3 w-full ${
                      sender?.email === user?.email
                        ? 'flex-row-reverse'
                        : 'justify-start'
                    }`}
                  >
                    <div className="w-10 h-10 overflow-hidden rounded-full">
                      <img
                        src={sender.picture}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <div
                        className={`relative ${
                          sender?.email === user?.email
                            ? 'bg-[#FFF4E1] before:border-[.3rem] before:border-[#FFF4E1] rounded-tl-lg rounded-bl-lg rounded-tr-lg before:absolute before:-bottom-[3px] before:-right-1 before:rounded-bl-xl before:-rotate-45'
                            : 'bg-[#E1ECFF] before:border-[.3rem] before:border-[#E1ECFF] rounded-tl-lg rounded-br-lg rounded-tr-lg before:absolute before:-bottom-[3px] before:-left-1 before:rounded-bl-xl before:-rotate-45'
                        } py-2 px-3`}
                      >
                        <p>{content}</p>
                        <p
                          className={`text-[10px] text-gray-300 absolute -bottom-4 ${
                            sender?.email === user?.email ? 'left-0' : 'right-0'
                          }`}
                        >
                          {time}
                        </p>
                      </div>
                    </div>
                  </div>
                )
              )}
            </div>
          ))}
        <div ref={messageEndRef} />
      </div>
      <form
        onSubmit={handleSubmit}
        className="flex items-center gap-4 px-5 py-5"
      >
        <div className="flex-1 bg-[#F5F6FA] rounded-lg">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type here..."
            className="focus:outline-none bg-transparent py-3 px-3 w-full"
          />
        </div>
        <button className="bg-purple-500 px-3 py-3 rounded-lg">
          <FaTelegramPlane className="text-2xl text-white" />
        </button>
      </form>
    </div>
  );
};

export default MessageForm;
