import React, { useState, useEffect } from 'react';
import VideoTag from './VideoTag';
import classNames from "classnames";
import './Meeting.css';
import endCallIcon from '../../media_photo/phone-call-end-svgrepo-com.png';
import microphoneIcon from '../../media_photo/microphone-svgrepo-com.png';
import screenMirrorIcon from '../../media_photo/screen-mirror-svgrepo-com.png';
import videoCameraIcon from '../../media_photo/video-camera-svgrepo-com.png';
import cameraTurnOff from '../../media_photo/cameraTurnOff.png';
import createNote from '../../media_photo/create-note.png';

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
    const [notes, setNotes] = useState("");
    const [notesVisible, setNotesVisible] = useState(false);
    const [saveStatus, setSaveStatus] = useState("");

    useEffect(() => {
        const loadNotes = async () => {
            const token = localStorage.getItem('token');
            try {
                const response = await fetch('http://127.0.0.1:8000/api/users/note/', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `${token}`,
                    },
                });
                if (response.ok) {
                    const data = await response.json();
                    setNotes(data.note);
                } else {
                    console.error('Error loading notes:', response.statusText);
                }
            } catch (error) {
                console.error('Error loading notes:', error);
            }
        };

        loadNotes();
    }, []);

    useEffect(() => {
        if (notesVisible) {
            const autoSaveInterval = setInterval(handleSaveNotes, 60000); // Auto-save every minute
            return () => clearInterval(autoSaveInterval);
        }
    }, [notesVisible, notes]);

    const handleSaveNotes = async () => {
        const token = localStorage.getItem('token');
        try {
            const response = await fetch('http://127.0.0.1:8000/api/users/note/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${token}`,
                },
                body: JSON.stringify({ note: notes }),
            });
            if (response.ok) {
                const data = await response.json();
                console.log('Notes saved:', data);
                setSaveStatus('Notes saved successfully!');
            } else {
                throw new Error('Failed to save notes');
            }
        } catch (error) {
            console.error('Error saving notes:', error);
            setSaveStatus('Error saving notes');
        } finally {
            setTimeout(() => setSaveStatus(''), 3000); // Clear save status after 3 seconds
        }
    };

    const handleOpenNotes = () => {
        setNotesVisible(true);
    };

    const handleHideNotes = () => {
        setNotesVisible(false);
        handleSaveNotes();
    };

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
                    <VideoTag srcObject={localVideoStream} />
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
                <VideoTag key={trackItem.streamId} srcObject={stream} />
            );
        });

        const hasActiveVideo = videoTags && videoTags.length > 0;

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
                <div className="username-text">
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
                <button
                    className="meeting-btn"
                    onClick={notesVisible ? handleHideNotes : handleOpenNotes}
                >
                    {notesVisible ? <img src={createNote} alt="Microphone" className="icon" /> : <img src={createNote} alt="Microphone" className="icon" />}
                </button>
            </div>
            <div className={`notes-container ${notesVisible ? 'open' : ''}`}>
                {notesVisible && (
                    <>
                        <textarea
                            className="meeting-notes"
                            placeholder="Ваши заметки..."
                            value={notes}
                            onChange={e => setNotes(e.target.value)}
                        />
                        <div className="save-status">{saveStatus}</div>
                        <div className="save-btn-container">
                            <button
                                className="meeting-btn save-notes"
                                onClick={handleSaveNotes}
                            >
                                Сохранить заметки
                            </button>
                            <button
                                className="meeting-btn hide-notes"
                                onClick={handleHideNotes}
                            >
                                Закрыть заметки
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default Meeting;
