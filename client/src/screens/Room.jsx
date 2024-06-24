import React, { useEffect, useCallback, useState } from "react";
import ReactPlayer from "react-player";
import peer from "../service/peer";
import { useSocket } from "../context/SocketProvider";
import { Button } from "@material-tailwind/react";

const RoomPage = () => {
  const socket = useSocket();
  const [roomId, setRoomId] = useState(localStorage.getItem("roomId") || null);
  const [remoteSocketId, setRemoteSocketId] = useState(null);
  const [myStream, setMyStream] = useState();
  const [remoteStream, setRemoteStream] = useState();

  const handleUserJoined = useCallback(({ email, id }) => {
    console.log(`Email ${email} joined room`);
    setRemoteSocketId(id);
  }, []);

  const handleCallUser = useCallback(async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });
    const offer = await peer.getOffer();
    socket.emit("user:call", { to: remoteSocketId, offer });
    setMyStream(stream);
  }, [remoteSocketId, socket]);

  const handleIncommingCall = useCallback(
    async ({ from, offer }) => {
      setRemoteSocketId(from);
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });
      setMyStream(stream);
      console.log(`Incoming Call`, from, offer);
      const ans = await peer.getAnswer(offer);
      socket.emit("call:accepted", { to: from, ans });
    },
    [socket]
  );

  const sendStreams = useCallback(() => {
    for (const track of myStream.getTracks()) {
      peer.peer.addTrack(track, myStream);
    }
  }, [myStream]);

  const handleCallAccepted = useCallback(
    ({ from, ans }) => {
      peer.setLocalDescription(ans);
      console.log("Call Accepted!");
      sendStreams();
    },
    [sendStreams]
  );

  const handleNegoNeeded = useCallback(async () => {
    const offer = await peer.getOffer();
    socket.emit("peer:nego:needed", { offer, to: remoteSocketId });
  }, [remoteSocketId, socket]);

  useEffect(() => {
    peer.peer.addEventListener("negotiationneeded", handleNegoNeeded);
    return () => {
      peer.peer.removeEventListener("negotiationneeded", handleNegoNeeded);
    };
  }, [handleNegoNeeded]);

  const handleNegoNeedIncomming = useCallback(
    async ({ from, offer }) => {
      const ans = await peer.getAnswer(offer);
      socket.emit("peer:nego:done", { to: from, ans });
    },
    [socket]
  );

  const handleNegoNeedFinal = useCallback(async ({ ans }) => {
    await peer.setLocalDescription(ans);
  }, []);

  useEffect(() => {
    peer.peer.addEventListener("track", handleTrack);
    return () => {
      peer.peer.removeEventListener("track", handleTrack);
    };
  }, []);

  const handleDisconnect = () => {
    // Notify other users about the disconnection
    socket.emit("user:disconnect");

    // Close the Peer connection and remove the stream
    peer.peer.close();
    setMyStream(null);
    setRemoteStream(null);
    setRemoteSocketId(null);
  };

  const handleReconnect = async () => {
    try {
      // Re-initialize Peer connection
      peer.init();

      // Get new offer
      const offer = await peer.getOffer();

      // Emit 'user:call' event with the new offer if remoteSocketId exists
      if (remoteSocketId) {
        socket.emit("user:call", { to: remoteSocketId, offer });
      }

    } catch (error) {
      console.error("Error reconnecting:", error);
    }
  };

  const handleTrack = async (ev) => {
    const remoteStream = ev.streams;
    console.log("GOT TRACKS!!");
    setRemoteStream(remoteStream[0]);
  };

  useEffect(() => {
    socket.on("user:joined", handleUserJoined);
    socket.on("incomming:call", handleIncommingCall);
    socket.on("call:accepted", handleCallAccepted);
    socket.on("peer:nego:needed", handleNegoNeedIncomming);
    socket.on("peer:nego:final", handleNegoNeedFinal);

    // Handle user disconnect event
    socket.on("user:disconnect", () => {
      setMyStream(null);
      setRemoteStream(null);
      setRemoteSocketId(null);
    });

    return () => {
      socket.off("user:joined", handleUserJoined);
      socket.off("incomming:call", handleIncommingCall);
      socket.off("call:accepted", handleCallAccepted);
      socket.off("peer:nego:needed", handleNegoNeedIncomming);
      socket.off("peer:nego:final", handleNegoNeedFinal);
      socket.off("user:disconnect");
    };
  }, [
    socket,
    handleUserJoined,
    handleIncommingCall,
    handleCallAccepted,
    handleNegoNeedIncomming,
    handleNegoNeedFinal,
  ]);

  return (
    <div>
      <p color="blue-gray" className="flex justify-center m-auto mt-10 text-4xl gap-1 mb-8">
        Welcome to <span className=" text-pink-400 font-light">DevXMeet</span>
      </p>
      <h4 className=" text-xl">{remoteSocketId ? "Connected" : "No one in room"}</h4>
      {myStream && <Button className=" my-4" onClick={sendStreams}>Send Stream</Button>}
      {remoteSocketId ? (
        <Button className=" my-4 mx-6" onClick={handleDisconnect}>Disconnect</Button>
      ) : (
        <Button className=" my-4 mx-6" onClick={handleReconnect}>Reconnect</Button>
      )}
      {remoteSocketId && <Button className=" my-4 mx-6" onClick={handleCallUser}>CALL</Button>}
      <div className="flex ">
        {myStream && (
          <>
            {/* <h1 className=" flex flex-col">My Stream</h1> */}
            <ReactPlayer
              playing
              // muted
              // height="100px"
              // width="200px"
              url={myStream}
            />
          </>
        )}
        {remoteStream && (
          <>
            {/* <h1>Remote Stream</h1> */}
            <ReactPlayer
              playing
              // muted
              // height="100px"
              // width="200px"
              url={remoteStream}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default RoomPage;
