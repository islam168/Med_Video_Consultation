// Meeting.js

import React from 'react';
import VideoTag from './VideoTag';
import classNames from "classnames";
import './Meeting.css';
import endCallIcon from '../../media_photo/phone-call-end-svgrepo-com.png';
import microphoneIcon from '../../media_photo/microphone-svgrepo-com.png';
import screenMirrorIcon from '../../media_photo/screen-mirror-svgrepo-com.png';
import videoCameraIcon from '../../media_photo/video-camera-svgrepo-com.png';
import cameraTurnOff from '../../media_photo/cameraTurnOff.png';

function Meeting({
                     handleMicBtn,
                     handleCameraBtn,
                     handleScreenBtn,
                     handleLeaveBtn,
                     localVideoStream,
                     onlineUsers,
                     remoteTracks,
                     username,
                     roomName,
                     meetingInfo,
                     micShared,
                     cameraShared,
                     screenShared,
                 }) {
    const userStreamMap = {};
    remoteTracks.forEach(trackItem => {
        if (!userStreamMap[trackItem.participantSessionId]) {
            userStreamMap[trackItem.participantSessionId] = [];
        }
        userStreamMap[trackItem.participantSessionId].push(trackItem);
    });

    const currentUserVideo = (
        <div className="video-container">
            <div className="video">
                {localVideoStream && cameraShared ? (
                    <VideoTag
                        srcObject={localVideoStream}
                    />
                ) : (
                    <div className="camera-off">
                        <img src={cameraTurnOff} alt="Camera Off" />
                    </div>
                )}
            </div>
            <div className="username-text text-center">
                {"Вы"}
            </div>
        </div>
    );


    const renderedOtherUsersVideos = onlineUsers.map(user => {
        if (user._id === meetingInfo.participantSessionId) {
            return null; // Skip self
        }

        const videoTags = userStreamMap[user._id]?.map(trackItem => {
            const stream = new MediaStream();
            stream.addTrack(trackItem.track);
            return (
                <VideoTag
                    key={trackItem.streamId}
                    srcObject={stream}
                />
            );
        });

        const hasActiveVideo = videoTags && videoTags.length > 0; // Check if user has active video streams

        return (
            <div key={user._id} className="video-container">
                <div className="video">
                    {hasActiveVideo ? (
                        videoTags
                    ) : (
                        <div className="camera-off">
                            <img src={cameraTurnOff} alt="Camera Off" />
                        </div>
                    )}
                </div>
                <div className="username-text text-center">
                    {user.name}
                </div>
            </div>
        );
    });


    const getButtonClass = shared => classNames("meeting-btn", { "btn-primary": shared });

    return (
        <div className="meeting-container">
            <div className="meeting-header">
                Meeting ID: {roomName}
            </div>
            <div className="video-grid">
                {renderedOtherUsersVideos}
                {currentUserVideo}
            </div>
            <div className="meeting-controls">
                <button
                    className={getButtonClass(micShared)}
                    onClick={handleMicBtn}
                >
                    <img src={microphoneIcon} alt="Microphone" className="icon" />
                </button>
                <button
                    className={getButtonClass(cameraShared)}
                    onClick={handleCameraBtn}
                >
                    <img src={videoCameraIcon} alt="Camera" className="icon" />
                </button>
                <button
                    className={getButtonClass(screenShared)}
                    onClick={handleScreenBtn}
                >
                    <img src={screenMirrorIcon} alt="Screen" className="icon" />
                </button>
                <button
                    className="meeting-btn end-call"
                    onClick={handleLeaveBtn}
                >
                    <img src={endCallIcon} alt="End Call" className="icon" />
                </button>
            </div>
        </div>
    );
}

export default Meeting;
