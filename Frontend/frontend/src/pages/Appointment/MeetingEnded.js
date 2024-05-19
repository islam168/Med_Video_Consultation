import React, { useEffect } from 'react';

function MeetingEnded() {
    useEffect(() => {
        window.location.reload();
    }, []);

    return <div>Meeting Ended</div>;
}

export default MeetingEnded;
