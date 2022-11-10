import React, { useContext, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BsChevronRight, BsDot } from 'react-icons/bs';
import { AppContext } from '../context/appContext';
import { addNotifications, resetNotifications } from '../features/userSlice';

const Sidebar = () => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [dropDown, setDropDown] = useState(true);
  const {
    socket,
    setMembers,
    members,
    setCurrentRoom,
    setRooms,
    privateMemberMsg,
    rooms,
    setPrivateMemberMsg,
    currentRoom,
  } = useContext(AppContext);

  const joinRoom = (room, isPublic = true) => {
    if (!user) {
      return aler('Please login');
    }

    socket.emit('join-room', room, currentRoom);
    setCurrentRoom(room);

    if (isPublic) {
      setPrivateMemberMsg(null);
    }

    dispatch(resetNotifications(room));
  };

  socket.off('notifications').on('notifications', (room) => {
    if (currentRoom !== room) dispatch(addNotifications(room));
  });

  useEffect(() => {
    if (user) {
      setCurrentRoom('general');
      getRooms();
      socket.emit('join-room', 'general');
      socket.emit('new-user');
    }
  }, []);

  socket.off('new-user').on('new-user', (payload) => {
    setMembers(payload);
  });

  const getRooms = () => {
    fetch(`${import.meta.env.VITE_APP_BASE_URL}/rooms`)
      .then((res) => res.json())
      .then((data) => setRooms(data));
  };

  function ordersId(id1, id2) {
    if (id1 > id2) {
      return id1 + '-' + id2;
    } else {
      return id2 + '-' + id1;
    }
  }

  const handlePrivateMemberMsg = (member) => {
    setPrivateMemberMsg(member);
    const roomId = ordersId(user._id, member._id);
    joinRoom(roomId, false);
  };

  return (
    <div className="w-[340px] bg-white rounded-3xl">
      <div className="py-3">
        <div
          className="flex items-center gap-4 cursor-pointer px-4 mb-3"
          onClick={() => setDropDown((prev) => !prev)}
        >
          <h4 className="text-base font-semibold">Rooms</h4>
          <BsChevronRight
            className={`${dropDown && 'rotate-90'} transition duration-300`}
          />
        </div>
        <div
          className={`${
            dropDown
              ? 'h-56 transition-height duration-300'
              : 'h-0 transition-height duration-300'
          } overflow-hidden`}
        >
          {rooms.map((room, i) => (
            <div
              key={i}
              className={`px-4 py-2 ${
                room === currentRoom && 'bg-[#F1EFFA] text-black'
              } cursor-pointer flex justify-between items-center capitalize py-4`}
              onClick={() => joinRoom(room)}
            >
              <span>{room}</span>
              {currentRoom !== room && (
                <span className="text-white text-xs bg-red-500 rounded-full px-[5px]">
                  {user.newMessages[room]}
                </span>
              )}
            </div>
          ))}
        </div>

        <div className="">
          <div className="flex items-center gap-4 cursor-pointer px-4 mt-5 mb-3">
            <h4 className="text-base font-semibold">Members</h4>
          </div>
          <div className="overflow-y-scroll scrollbar h-[220px]">
            {members.map((member) => (
              <div
                key={member._id}
                onClick={() => handlePrivateMemberMsg(member)}
                className={`py-2 ${
                  privateMemberMsg?._id === member?._id &&
                  'bg-blue-400 text-white'
                } cursor-pointer ${
                  member._id === user._id && 'hidden'
                } flex items-center gap-3`}
              >
                <div className="relative px-4">
                  <div className="w-8 h-8 rounded-full overflow-hidden border">
                    <img
                      src={
                        member.picture ||
                        'https://scai.kibu.ac.ke/wp-content/uploads/2021/10/NoProfile.png'
                      }
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {member.status === 'online' ? (
                    <BsDot className="text-4xl absolute -bottom-3 right-0 text-green-600" />
                  ) : (
                    <BsDot className="text-4xl absolute -bottom-3 right-0 text-orange-500" />
                  )}
                </div>
                <p>{member.name}</p>
                <span className="text-white text-xs bg-red-500 rounded-full px-[5px] ml-auto mr-3">
                  {user.newMessages[ordersId(member._id, user._id)]}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
