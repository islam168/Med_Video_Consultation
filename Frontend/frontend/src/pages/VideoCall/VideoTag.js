import React, { useRef, useEffect, useState } from 'react';


function VideoTag({ srcObject, className }) {
    const videoRef = useRef();
    const [aspectRatio, setAspectRatio] = useState(16 / 9); // Default aspect ratio

    useEffect(() => {
        const calculateAspectRatio = () => {
            if (videoRef.current && videoRef.current.videoWidth && videoRef.current.videoHeight) {
                const { videoWidth, videoHeight } = videoRef.current;
                setAspectRatio(videoWidth / videoHeight);
            }
        };

        if (videoRef.current && srcObject) {
            videoRef.current.srcObject = srcObject;
            videoRef.current.addEventListener('loadedmetadata', calculateAspectRatio);
        }

        return () => {
            if (videoRef.current) {
                videoRef.current.removeEventListener('loadedmetadata', calculateAspectRatio);
            }
        };
    }, [srcObject]);

    const videoStyle = {
        width: '100%',
        height: 'auto',
        maxWidth: '100%',
        maxHeight: '100%',
        objectFit: 'contain',
    };

    return (
        <div className={className}>
            <video ref={videoRef} autoPlay playsInline style={videoStyle} />
        </div>
    );
}



export default VideoTag;
