import React from 'react';
import { BsChatDots } from 'react-icons/bs';
import { useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import { useLogoutUserMutation } from '../services/appApi';
import { AiOutlineLogin } from 'react-icons/ai';

const Navigation = () => {
  const location = useLocation();
  const user = useSelector((state) => state.user);
  const [logoutUser] = useLogoutUserMutation();

  const handleLogout = async (e) => {
    e.preventDefault();
    await logoutUser(user);

    window.location.replace('/');
  };

  return (
    <>
      {location.pathname !== '/' && location.pathname !== '/signup' && (
        <div className="flex justify-between items-center container mt-4 bg-white shadow-sm rounded-lg py-3 px-10">
          <div className="flex flex-col items-center gap-1">
            <BsChatDots className="text-2xl text-blue-500" />
            <span className="font-semibold text-blue-500">Chat</span>
          </div>
          <div className="flex items-center gap-5 uppercase">
            <Link to="/chat">Chat</Link>
            {user && (
              <div className="flex items-center gap-2">
                <div className="border w-10 h-10 rounded-full overflow-hidden">
                  <img
                    src={user.picture}
                    alt={user.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <span>{user.name}</span>
                <div className="ml-4 cursor-pointer" onClick={handleLogout}>
                  <AiOutlineLogin className="text-2xl" />
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Navigation;
