import React, { useContext, useState } from 'react';
import { BsChatDots } from 'react-icons/bs';
import { ToastContainer, toast } from 'react-toastify';
import { useLoginUserMutation } from '../services/appApi';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/appContext';
import { Oval } from 'react-loader-spinner';
import { Link } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const { socket } = useContext(AppContext);
  const [loginUser, { isLoading, error }] = useLoginUserMutation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();

    loginUser({ email, password }).then(({ data }) => {
      if (data) {
        socket.emit('new-user');
        navigate('/chat');
      }
    });
  };

  return (
    <>
      <div className="bg-white h-screen">
        <div className="flex flex-col justify-center h-full w-full max-w-[400px] mx-auto">
          <div className="flex flex-col items-center gap-1 mb-3">
            <BsChatDots className="text-6xl text-blue-500" />
            <span className="text-2xl font-semibold text-blue-500">Chat</span>
          </div>
          <h1 className="text-3xl font-semibold">Welcome back</h1>
          <p className="text-slate-400 text-sm mt-3">
            Welcome back! Please enter your email and password.
          </p>

          <form className="mt-6" onSubmit={handleLogin}>
            <div className="flex flex-col gap-1">
              <label>Email</label>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="focus:outline-none border border-blue-300 py-2 px-2 w-[385px] rounded-md"
              />
            </div>
            <div className="flex flex-col mt-3 gap-1">
              <label>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="focus:outline-none border border-blue-300 py-2 px-2 w-[385px] rounded-md"
              />
            </div>
            {error && (
              <div className="text-center bg-red-300 text-red-600 py-2 px-2 w-[385px] rounded-md mt-5">
                {error.data}
              </div>
            )}
            <button className="text-white bg-cyan-600 w-[385px] py-2 mt-6 rounded-md hover:bg-cyan-800 transition duration-200">
              {isLoading ? (
                <div className="flex justify-center">
                  <Oval
                    height={20}
                    width={20}
                    color="#FFE9A0"
                    wrapperStyle={{}}
                    wrapperClass=""
                    visible={true}
                    ariaLabel="oval-loading"
                    secondaryColor="#FFE9A0"
                    strokeWidth={2}
                    strokeWidthSecondary={2}
                  />
                </div>
              ) : (
                'Sign in'
              )}
            </button>
            <p className="text-right text-sm mr-3 mt-4 text-gray-400">
              Don't have account?{' '}
              <Link to="/signup" className="underline">
                Sign up
              </Link>
            </p>
          </form>
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default Login;
