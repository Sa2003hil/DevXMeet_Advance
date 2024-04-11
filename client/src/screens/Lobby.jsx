import React, { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSocket } from "../context/SocketProvider";
import { Button } from "@material-tailwind/react";


const LobbyScreen = () => {
  const [email, setEmail] = useState("");
  const [room, setRoom] = useState("");

  const socket = useSocket();
  const navigate = useNavigate();

  const handleSubmitForm = useCallback(
    (e) => {
      e.preventDefault();
      socket.emit("room:join", { email, room });
    },
    [email, room, socket]
  );

  const handleJoinRoom = useCallback(
    (data) => {
      const { email, room } = data;
      navigate(`/room/${room}`);
    },
    [navigate]
  );

  useEffect(() => {
    socket.on("room:join", handleJoinRoom);
    return () => {
      socket.off("room:join", handleJoinRoom);
    };

  }, [socket, handleJoinRoom]);

  return (
    <>
      <div className="flex h-screen w-screen items-center justify-center">
        <div class="relative h-[90vh] flex flex-col text-gray-700 bg-white shadow-md w-[30vw] rounded-xl bg-clip-border">
          <p color="blue-gray" className="flex justify-center m-auto text-gray-500 text-2xl font-extralight gap-1 mb-3">
            Join Now
          </p>
          <hr className=" mb-2 w-[50%] m-auto" />
          <p color="blue-gray" className="flex justify-center m-auto text-4xl gap-1 mb-8">
            Welcome to <span className=" text-pink-400 font-light">DevXMeet</span>
          </p>
          <form onSubmit={handleSubmitForm}>
            <div class="flex flex-col gap-4 p-6">
              <div class="relative h-11 w-full min-w-[200px]">
                <input
                  class="w-full h-full px-3 py-3 font-sans text-sm font-normal transition-all bg-transparent border rounded-md peer border-blue-gray-200 border-t-transparent text-blue-gray-700 outline outline-0 placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 focus:border-2 focus:border-gray-900 focus:border-t-transparent focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50"
                  placeholder=" "
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />

                <label
                  class="before:content[' '] after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none !overflow-visible truncate text-[11px] font-normal leading-tight text-gray-500 transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:border-blue-gray-200 before:transition-all after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-blue-gray-200 after:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[4.1] peer-placeholder-shown:text-blue-gray-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-gray-900 peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:before:!border-gray-900 peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-focus:after:!border-gray-900 peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500">
                  email
                </label>
              </div>
              <div class="relative h-11 w-full min-w-[200px]">
                <input
                  class="w-full h-full px-3 py-3 font-sans text-sm font-normal transition-all bg-transparent border rounded-md peer border-blue-gray-200 border-t-transparent text-blue-gray-700 outline outline-0 placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 focus:border-2 focus:border-gray-900 focus:border-t-transparent focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50"
                  placeholder=" "
                  type="text"
                  // type="text"
                  id="room"
                  value={room}
                  onChange={(e) => setRoom(e.target.value)}
                />
                <label
                  class="before:content[' '] after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none !overflow-visible truncate text-[11px] font-normal leading-tight text-gray-500 transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:border-blue-gray-200 before:transition-all after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-blue-gray-200 after:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[4.1] peer-placeholder-shown:text-blue-gray-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-gray-900 peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:before:!border-gray-900 peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-focus:after:!border-gray-900 peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500">
                  Room Code
                </label>
              </div>
              <div class="-ml-2.5">
                <div class="inline-flex items-center">
                  <label htmlFor="checkbox" class="relative flex items-center p-3 rounded-full cursor-pointer">
                    <input type="checkbox"
                      class="before:content[''] peer relative h-5 w-5 cursor-pointer appearance-none rounded-md border border-blue-gray-200 transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-12 before:w-12 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-blue-gray-500 before:opacity-0 before:transition-opacity checked:border-gray-900 checked:bg-gray-900 checked:before:bg-gray-900 hover:before:opacity-10"
                      id="checkbox" />
                    <span
                      class="absolute text-white transition-opacity opacity-0 pointer-events-none top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 peer-checked:opacity-100">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor"
                        stroke="currentColor" stroke-width="1">
                        <path fill-rule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clip-rule="evenodd"></path>
                      </svg>
                    </span>
                  </label>
                  <label class="mt-px font-light text-gray-700 cursor-pointer select-none" htmlFor="checkbox">
                    Remember Me
                  </label>
                </div>
              </div>
            </div>
            <div class="p-6 pt-0">
              <button
                // onClick={handleRoomJoin}
                class="block w-full select-none rounded-lg bg-gradient-to-tr from-gray-900 to-gray-800 py-3 px-6 text-center align-middle font-sans text-xs font-bold uppercase text-white shadow-md shadow-gray-900/10 transition-all hover:shadow-lg hover:shadow-gray-900/20 active:opacity-[0.85] disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                type="submit">
                Join
              </button>
              <p class="flex justify-center mt-6 font-sans text-sm antialiased font-light leading-normal text-inherit">
                You can try our other WebApps{' '}
                <a href="#signup"
                  class="block ml-1 font-sans text-sm antialiased font-bold leading-normal text-blue-gray-900">
                  given below
                </a>
              </p>
              <div className="flex mb-9 mt-10 gap-4 items-center justify-center w-full">
                <Button size="lg" color="white" className="flex items-center justify-center w-full h-fit border shadow-md">
                  <img src="https://codewithsahil.vercel.app/static/media/logo.6d999d05d906b9bbf4a3.png" alt="metamask" className="h-8 rounded-md" />
                </Button>
                <Button size="lg" color="white" className="flex items-center justify-center w-full h-fit border shadow-md">
                  <img src="https://www.svgrepo.com/show/69341/apple-logo.svg" alt="metamask" className="h-8 p-1" />
                </Button>
                <Button size="lg" color="white" className="flex items-center justify-center w-full h-fit border shadow-md">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/2021_Facebook_icon.svg/2048px-2021_Facebook_icon.svg.png" alt="metamask" className="h-8 p-1" />
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default LobbyScreen;
