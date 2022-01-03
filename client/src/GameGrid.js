import { Card, FormControl, Col, Row, Figure, Image, Nav, Dropdown, DropdownButton, ButtonGroup, Container, Button } from 'react-bootstrap';
import * as Icons from 'react-bootstrap-icons';
import { Link } from 'react-router-dom';
import './grid.css'
import { useState, useEffect } from 'react';



function GameGrid(props) {
    //This matrix will be passed trough API from the server
    var matrix = props.puzzle;

    const [firstLetter, setFirstLetter] = useState(-1);
    const [lastLetter, setLastLetter] = useState(-1);
    const handleFirstLetter = (bool) => {
        setFirstLetter(bool);
    }

    return (
        props.loading ? <h2 className='text-center'>Loading</h2> :
            <>
                <Figure className={'external-frame' + `${props.gameDifficult}`}>
                    {matrix.slice(0, matrix.length).map((innerMatrix, index) => {
                        return (
                            <Row key={index}>
                                {innerMatrix.map((element, innerIndex) => {
                                    return (
                                        <div
                                            className={"frame text_image" + `${props.gameDifficult}`}
                                            key={innerIndex + index * (props.gameDifficult * 6)}
                                        >
                                            <div style={{ color: `black` }} key={innerIndex + index * (props.gameDifficult * 6)}>
                                                {element}
                                            </div>
                                        </div>
                                    )
                                })}

                            </Row>
                        )
                    })}
                </Figure>

            </>
    );

}


export { GameGrid };