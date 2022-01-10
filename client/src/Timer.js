import React from 'react'
import { useState, useEffect } from 'react';

function Timer(props) {
    const initialSeconds = 60; //***change this number to debug faster***
    const [seconds, setSeconds] = useState(initialSeconds);
    useEffect(() => {
        let myInterval = setInterval(() => {
            if (props.start && seconds > 0 && !props.exitGame) {
                setSeconds(seconds - 1);
            }
            else if (seconds == 0 || props.exitGame) {
                props.handleShowScoreModal(true);
                if (props.loggedIn) {
                    const game = { username: props.user, score: props.score };
                    props.createGame(game).then(() => {
                        props.handleStart(false);
                        props.handleExitGame(false);
                        props.handleShowScoreModal(true);
                    }).catch()
                }
                else {
                    props.handleStart(false);
                    props.handleExitGame(false);
                    props.handleShowScoreModal(true);
                }
                setSeconds(60) //***change this number to debug faster***
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