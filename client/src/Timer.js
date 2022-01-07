import React from 'react'
import { useState, useEffect } from 'react';

function Timer(props) {
    const initialSeconds = 5;
    const [seconds, setSeconds] = useState(initialSeconds);
    useEffect(() => {
        let myInterval = setInterval(() => {
            if (props.start && seconds > 0) {
                setSeconds(seconds - 1);
            }
            if(seconds == 0){
                props.handleTimeOver(true);
            }
        }, 1000)
        return () => {
            clearInterval(myInterval);
        };
    });

    return (
        <div>
            {!props.start
                ? <h3>Time Left: 60</h3>
                : <h3> Time Left: {seconds < 10 ? `0${seconds}` : seconds}</h3>
            }
        </div>
    )
}

export { Timer };