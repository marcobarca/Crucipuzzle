import { Card, FormControl, Col, Row, Figure, Image, Nav, Dropdown, DropdownButton, ButtonGroup, Container, Button } from 'react-bootstrap';
import * as Icons from 'react-bootstrap-icons';
import { Link } from 'react-router-dom';
import './grid.css'
import { useState, useEffect } from 'react';
import React from 'react';



function GameGrid(props) {

    var matrix = props.puzzle;

    //The index of the cell selected is calculated by: ColumnIndex + (RowIndex * (GameDifficult * 6))

    //First letter selected
    const [firstLetter, setFirstLetter] = useState(-1);
    const handleFirstLetter = (n) => {
        setFirstLetter(n);
    }

    //Last Letter selected
    const [lastLetter, setLastLetter] = useState(-1);
    const handleLastLetter = (n) => {
        setLastLetter(n);
    }

    function verifySelected(innerIndex, index){
        if(firstLetter == (innerIndex + index * (props.gameDifficult * 6)) || lastLetter == (innerIndex + index * (props.gameDifficult * 6)))
            return true;
        else   
            return false;
    }


    return (
        props.loading ? <h2 className='text-center'>Loading</h2> :
            <>
                <Figure className={'external-frame' + `${props.gameDifficult}`} >
                    {matrix.slice(0, matrix.length).map((innerMatrix, index) => {
                        return (
                            <Row key={index} >
                                {innerMatrix.map((element, innerIndex) => {
                                    return (
                                        <Container
                                            className={"frame" + `${ verifySelected(innerIndex, index) ? "-selected" : ''}` + " text_image" + `${props.gameDifficult}`}
                                            key={innerIndex + index * (props.gameDifficult * 6)}
                                            onClick={() => {
                                                //Unselect the firstLetter (also the Last letter will be unselected)
                                                if(firstLetter == (innerIndex + index * (props.gameDifficult * 6))){
                                                    handleFirstLetter(-1);
                                                    handleLastLetter(-1);
                                                }
                                                //Unselect the firstLetter
                                                if(lastLetter == (innerIndex + index * (props.gameDifficult * 6)))
                                                handleFirstLetter(-1);

                                                //Select the FirstLetter
                                                else if(firstLetter == -1)
                                                    handleFirstLetter(innerIndex + index * (props.gameDifficult * 6))

                                                //Select the LastLetter
                                                else if(firstLetter != -1 && firstLetter != (innerIndex + index * (props.gameDifficult * 6)))
                                                    handleLastLetter(innerIndex + index * (props.gameDifficult * 6))
                                            }}
                                        >
                                            {element}
                                        </Container>
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