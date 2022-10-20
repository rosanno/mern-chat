import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSignupUserMutation } from '../services/appApi';
import { AiFillPlusCircle } from 'react-icons/ai';
import { Link } from 'react-router-dom';
import { BsChatDots } from 'react-icons/bs';
import { Oval } from 'react-loader-spinner';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Signup = () => {
  const navigate = useNavigate();
  const imgPickerRef = useRef();
  const [signupUser, { isLoading, error }] = useSignupUserMutation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [image, setImage] = useState(null);
  const [uploadingImg, setUploadingImg] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  const previewImage = (e) => {
    const selectedImg = e.target.files[0];

    if (selectedImg.size > 1048576) {
      return toast.error('Max file size is 1mb');
    } else {
      setImage(selectedImg);
      setImagePreview(URL.createObjectURL(selectedImg));
    }
  };

  const uploadImage = async () => {
    const data = new FormData();
    data.append('file', image);
    data.append('upload_preset', 'wnougo3n');
    try {
      setUploadingImg(true);
      let res = await fetch(
        'https://api.cloudinary.com/v1_1/dwl14dsh7/image/upload',
        {
          method: 'POST',
          body: data,
        }
      );
      const urlData = await res.json();
      setUploadingImg(false);
      return urlData.url;
    } catch (error) {
      setUploadingImg(false);
      console.log(error);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!image) return toast.error('Please upload your profile picture');
    const url = await uploadImage(image);
    console.log(url);
    signupUser({ name, email, password, picture: url }).then(({ data }) => {
      if (data) {
        console.log(data);
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
          <h1 className="text-3xl font-semibold text-center">Create account</h1>
          <div className="relative self-center mt-4">
            <div className="border w-full rounded-full overflow-hidden">
              <img
                src={
                  imagePreview ||
                  'https://scai.kibu.ac.ke/wp-content/uploads/2021/10/NoProfile.png'
                }
                alt=""
                className="w-24 h-24 object-cover"
              />
            </div>
            <input
              ref={imgPickerRef}
              type="file"
              id="image-upload"
              accept="image/png, image/jpeg"
              hidden
              onChange={previewImage}
            />
            <button
              className="absolute bottom-0 right-0"
              onClick={() => imgPickerRef.current.click()}
            >
              <AiFillPlusCircle className=" text-2xl text-green-800 cursor-pointer" />
            </button>
          </div>

          <form className="mt-6" onSubmit={handleSignup}>
            <div className="flex flex-col gap-1 mb-3">
              <label>Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                className="focus:outline-none border border-blue-300 py-2 px-2 w-[385px] rounded-md"
              />
            </div>
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
              <div>
                {uploadingImg || isLoading ? (
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
                  <span className="font-semibold">Sign up</span>
                )}
              </div>
            </button>
          </form>
          <p className="text-right text-sm mr-3 mt-4 text-gray-400">
            Have an account?
            <Link to="/" className="underline">
              Login
            </Link>
          </p>
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default Signup;
