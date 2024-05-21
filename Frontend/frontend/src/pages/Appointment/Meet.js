import axios from "axios";
import { useEffect, useState } from "react";
import Appointment from "./Appointment";
import Meeting from "./Meeting";
import MeetingEnded from "./MeetingEnded";

const meteredMeeting = new window.Metered.Meeting();

function Meet({ updateNavFooterVisibility }) {
    const [meetingJoined, setMeetingJoined] = useState(false);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [remoteTracks, setRemoteTracks] = useState([]);
    const [username, setUsername] = useState("");
    const [localVideoStream, setLocalVideoStream] = useState(null);
    const [micShared, setMicShared] = useState(false);
    const [cameraShared, setCameraShared] = useState(false);
    const [screenShared, setScreenShared] = useState(false);
    const [meetingEnded, setMeetingEnded] = useState(false);
    const [roomName, setRoomName] = useState(null);
    const [meetingInfo, setMeetingInfo] = useState({});

    useEffect(() => {
        meteredMeeting.on("remoteTrackStarted", (trackItem) => {
            remoteTracks.push(trackItem);
            setRemoteTracks([...remoteTracks]);
        });

        meteredMeeting.on("remoteTrackStopped", (trackItem) => {
            for (let i = 0; i < remoteTracks.length; i++) {
                if (trackItem.streamId === remoteTracks[i].streamId) {
                    remoteTracks.splice(i, 1);
                }
            }
            setRemoteTracks([...remoteTracks]);
        });

        meteredMeeting.on("participantJoined", (localTrackItem) => {});

        meteredMeeting.on("participantLeft", (localTrackItem) => {});

        meteredMeeting.on("onlineParticipants", (onlineParticipants) => {
            setOnlineUsers([...onlineParticipants]);
        });

        meteredMeeting.on("localTrackUpdated", (item) => {
            const stream = new MediaStream(item.track);
            setLocalVideoStream(stream);
        });

        return () => {
            meteredMeeting.removeListener("remoteTrackStarted");
            meteredMeeting.removeListener("remoteTrackStopped");
            meteredMeeting.removeListener("participantJoined");
            meteredMeeting.removeListener("participantLeft");
            meteredMeeting.removeListener("onlineParticipants");
            meteredMeeting.removeListener("localTrackUpdated");
        };
    }, [remoteTracks]);

    const handleJoinMeeting = async (roomName, username) => {
        roomName = roomName.trim();
        const response = await axios.get(
            "http://localhost:8000/api/users/validate-meeting?roomName=" + roomName
        );

        if (response.data.roomFound) {
            const { data } = await axios.get("http://localhost:8000/api/users/metered-domain");
            const METERED_DOMAIN = data.METERED_DOMAIN;

            const joinResponse = await meteredMeeting.join({
                name: username,
                roomURL: METERED_DOMAIN + "/" + roomName,
            });

            setUsername(username);
            setRoomName(roomName);
            setMeetingInfo(joinResponse);
            setMeetingJoined(true);
            updateNavFooterVisibility(false);
        } else {
            alert("Invalid roomName");
        }
    };

    const handleMicBtn = async () => {
        if (micShared) {
            await meteredMeeting.stopAudio();
            setMicShared(false);
        } else {
            await meteredMeeting.startAudio();
            setMicShared(true);
        }
    };

    const handleCameraBtn = async () => {
        if (cameraShared) {
            await meteredMeeting.stopVideo();
            setLocalVideoStream(null);
            setCameraShared(false);
        } else {
            await meteredMeeting.startVideo();
            var stream = await meteredMeeting.getLocalVideoStream();
            setLocalVideoStream(stream);
            setCameraShared(true);
        }
    };

    const handleScreenBtn = async () => {
        if (!screenShared) {
            await meteredMeeting.startScreenShare();
            setScreenShared(false);
        } else {
            await meteredMeeting.stopVideo();
            setCameraShared(false);
            setScreenShared(true);
        }
    };

    const handleLeaveBtn = async () => {
        await meteredMeeting.leaveMeeting();
        setMeetingEnded(true);
        updateNavFooterVisibility(true);
    };

    return (
        <div className="App">
            {meetingJoined ? (
                meetingEnded ? (
                    <MeetingEnded />
                ) : (
                    <Meeting
                        handleMicBtn={handleMicBtn}
                        handleCameraBtn={handleCameraBtn}
                        handleScreenBtn={handleScreenBtn}
                        handleLeaveBtn={handleLeaveBtn}
                        localVideoStream={localVideoStream}
                        onlineUsers={onlineUsers}
                        remoteTracks={remoteTracks}
                        username={username}
                        roomName={roomName}
                        meetingInfo={meetingInfo}
                        micShared={micShared}
                        cameraShared={cameraShared}
                        screenShared={screenShared}
                    />
                )
            ) : (
                <Appointment handleJoinMeeting={handleJoinMeeting} />
            )}
        </div>
    );
}

export default Meet;
