import { Card, FormControl, Col, Row, Figure, Image, Nav, Dropdown, DropdownButton, ButtonGroup, Container, Button } from 'react-bootstrap';
import * as Icons from 'react-bootstrap-icons';
import { Link } from 'react-router-dom';
import './grid.css'
import { useState, useEffect } from 'react';
import * as API from './API';



function GameGrid(props) {

    var matrix = props.puzzle;

    //The index of the cell selected is calculated by: ColumnIndex + (RowIndex * (GameDifficult * 6))

    //First letter selected
    const [firstLetter, setFirstLetter] = useState(-1);
    const handleFirstLetter = (n) => {
        setFirstLetter(n);
    }

    const [lastLetter, setLastLetter] = useState(-1);
    const handleLastLetter = (n) => {
        setLastLetter(n);
    }


    //Selected words
    const [selectedWords, setSelectedWords] = useState({});
    const handleSelectedWords = (firstPosition, secondPosition) => {
        let tmp = selectedWords;
        tmp[firstPosition] = secondPosition;
        setSelectedWords(tmp)
    }
    function checkAlreadySelected(firstPosition, secondPosition) {
        if (selectedWords[firstPosition] == secondPosition)
            return true;
        else
            return false;
    }

    //This state allows the word to light on
    const [newWord, setNewWord] = useState(false);
    const handleNewWord = (bool) => {
        setNewWord(bool)
    }


    //This function check if the letter is selected, based on the states (firstLetter and lastLetter)
    function verifySelected(innerIndex, index) {
        if (firstLetter == innerIndex + index * (props.gameDifficult * 6) || lastLetter == innerIndex + index * (props.gameDifficult * 6))
            return true;
        else
            return false;
    }

    function verifyFound(innerIndex, index) {
        if (newWord) {
            for (let i = 0; i < props.brightCells.length; i++)
                if (props.brightCells[i] == innerIndex + index * (props.gameDifficult * 6))
                    return true
            return false;
        }
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
                                            className={"frame" + `${verifySelected(innerIndex, index) ? "-selected" : `${verifyFound(innerIndex, index) ? "-found" : ''}`}` + " text_image" + `${props.gameDifficult}`}
                                            key={innerIndex + index * (props.gameDifficult * 6)}
                                            onClick={() => {

                                                game_logic: {

                                                    //Unselect the firstLetter (also the Last letter will be unselected)
                                                    if (firstLetter == (innerIndex + index * (props.gameDifficult * 6))) {
                                                        handleFirstLetter(-1);
                                                        handleLastLetter(-1);

                                                    }

                                                    //Unselect the lastLetter
                                                    else if (lastLetter == (innerIndex + index * (props.gameDifficult * 6))) {
                                                        handleLastLetter(-1);

                                                    }

                                                    //Select the FirstLetter
                                                    else if (firstLetter == -1) {
                                                        handleFirstLetter(innerIndex + index * (props.gameDifficult * 6))

                                                    }

                                                    //Select the LastLetter (the last selected letter defines the direction)
                                                    else if (firstLetter != -1 && firstLetter != (innerIndex + index * (props.gameDifficult * 6)) && lastLetter == -1) {

                                                        handleLastLetter(innerIndex + index * (props.gameDifficult * 6))

                                                        //The word has already been discoved
                                                        if (checkAlreadySelected(firstLetter, lastLetter)) {
                                                            handleFirstLetter(-1);
                                                            handleLastLetter(-1);
                                                            break game_logic;
                                                        }

                                                        let gridFactor = props.gameDifficult * 6
                                                        let firstPosition = firstLetter;
                                                        let lastPosition = innerIndex + index * gridFactor;

                                                        let rowIndexFirst = ~~(firstPosition / gridFactor)
                                                        let colIndexFirst = firstPosition % gridFactor

                                                        let rowIndexLast = ~~(lastPosition / gridFactor)
                                                        let colIndexLast = lastPosition % gridFactor

                                                        //THIS SWITCH PERMITS TO HANDLE THE 8 DIRECTIONS

                                                        switch (lastPosition > firstPosition) {

                                                            //lastLetter > firstLetter (Positive case)
                                                            case (true):

                                                                // ------------------------------- //
                                                                // ------Orizontal positive------- //
                                                                // ------------------------------- //
                                                                if (rowIndexFirst == rowIndexLast) {

                                                                    console.log("Orizontal positive")

                                                                    let numberOfLetters = (colIndexLast - colIndexFirst) + 1

                                                                    //Adding the firt letter the word
                                                                    let word = matrix[rowIndexFirst][colIndexFirst]

                                                                    for (let i = (colIndexFirst) + 1; i < colIndexLast + 1; i++) {
                                                                        word += `${matrix[rowIndexFirst][i]}`
                                                                    }

                                                                    //check the word on the vocabulary
                                                                    API.getWordCheck(word).then((result) => {
                                                                        if (result) {

                                                                            //light on all the letters
                                                                            for (let i = firstPosition; i <= lastPosition; i++)
                                                                                props.handleBrightCells(i)
                                                                            handleNewWord(true);

                                                                            //Adding the score
                                                                            props.handleScore(numberOfLetters)

                                                                            //Adding the word to the words discovered list
                                                                            handleSelectedWords(firstLetter, lastLetter);
                                                                        }
                                                                    })
                                                                    handleFirstLetter(-1);
                                                                    handleLastLetter(-1);

                                                                    break game_logic;
                                                                }

                                                                // ------------------------------- //
                                                                // -------Vertical positive------- //
                                                                // ------------------------------- //
                                                                else if (colIndexFirst == colIndexLast) {

                                                                    console.log('Vertical positive')

                                                                    let numberOfLetters = (rowIndexLast - rowIndexFirst) + 1

                                                                    //Adding the firt letter the word
                                                                    let word = matrix[rowIndexFirst][colIndexFirst]

                                                                    for (let i = rowIndexFirst + 1; i < rowIndexLast + 1; i++) {
                                                                        word += `${matrix[i][colIndexFirst]}`
                                                                    }

                                                                    //check the word on the vocabulary
                                                                    API.getWordCheck(word).then((result) => {
                                                                        if (result) {

                                                                            //light on all the letters
                                                                            for (let i = firstPosition; i <= lastPosition; i = i + gridFactor)
                                                                                props.handleBrightCells(i)
                                                                            handleNewWord(true);

                                                                            //Adding the score
                                                                            props.handleScore(numberOfLetters)

                                                                            //Adding the word to the words discovered list
                                                                            handleSelectedWords(firstLetter, lastLetter);

                                                                        }
                                                                    })
                                                                    handleFirstLetter(-1);
                                                                    handleLastLetter(-1);

                                                                    break game_logic;
                                                                }

                                                                // ------------------------------- //
                                                                //-------Oblique positive(>)------ //
                                                                // ------------------------------- //
                                                                else if (rowIndexLast > rowIndexFirst && colIndexLast > colIndexFirst) {

                                                                    console.log('Oblique positive(>)')

                                                                    let numberOfLetters = (rowIndexLast - rowIndexFirst) + 1

                                                                    //The selection is not oblique
                                                                    if (colIndexLast != (colIndexFirst + numberOfLetters - 1)) {
                                                                        handleLastLetter(-1);
                                                                        break;
                                                                    }

                                                                    //Adding the firt letter the word
                                                                    let word = matrix[rowIndexFirst][colIndexFirst]

                                                                    let colIndex = colIndexFirst + 1;

                                                                    for (let i = rowIndexFirst + 1; i < rowIndexLast + 1; i++) {
                                                                        word += `${matrix[i][colIndex]}`
                                                                        colIndex++;
                                                                    }

                                                                    //check the word on the vocabulary
                                                                    API.getWordCheck(word).then((result) => {
                                                                        if (result) {

                                                                            //light on all the letters
                                                                            let index = 0;
                                                                            for (let i = firstPosition; i <= lastPosition; i = i + gridFactor) {
                                                                                props.handleBrightCells(i + index)
                                                                                index++;
                                                                            }
                                                                            handleNewWord(true);

                                                                            //Adding the score
                                                                            props.handleScore(numberOfLetters)

                                                                            //Adding the word to the words discovered list
                                                                            handleSelectedWords(firstLetter, lastLetter);

                                                                        }
                                                                    })
                                                                    handleFirstLetter(-1);
                                                                    handleLastLetter(-1);

                                                                    break game_logic;
                                                                }

                                                                // ------------------------------- //
                                                                // -------Oblique positive(<)----- //
                                                                // ------------------------------- //
                                                                else if (rowIndexLast > rowIndexFirst && colIndexLast < colIndexFirst) {

                                                                    console.log('Oblique positive(<)')

                                                                    let numberOfLetters = (rowIndexLast - rowIndexFirst) + 1

                                                                    //The selection is not oblique
                                                                    if (colIndexLast != (colIndexFirst - (numberOfLetters - 1))) {
                                                                        handleLastLetter(-1);
                                                                        break;
                                                                    }

                                                                    //Adding the firt letter the word
                                                                    let word = matrix[rowIndexFirst][colIndexFirst]

                                                                    let colIndex = colIndexFirst - 1;

                                                                    for (let i = rowIndexFirst + 1; i < rowIndexLast + 1; i++) {
                                                                        word += `${matrix[i][colIndex]}`
                                                                        colIndex--;
                                                                    }

                                                                    //check the word on the vocabulary
                                                                    API.getWordCheck(word).then((result) => {
                                                                        if (result) {

                                                                            //light on all the letters
                                                                            let index = 0;
                                                                            for (let i = firstPosition; i <= lastPosition + gridFactor; i = i + gridFactor) {
                                                                                props.handleBrightCells(i + index)
                                                                                index--;
                                                                            }
                                                                            handleNewWord(true);

                                                                            //Adding the score
                                                                            props.handleScore(numberOfLetters)

                                                                            //Adding the word to the words discovered list
                                                                            handleSelectedWords(firstLetter, lastLetter);
                                                                        }
                                                                    })
                                                                    handleFirstLetter(-1);
                                                                    handleLastLetter(-1);

                                                                    break game_logic;
                                                                }

                                                            //---------------------------------------------------------------------------------------------------------
                                                            //lastLetter < firstLetter (negative case)
                                                            case (false):
                                                                // ------------------------------- //
                                                                // ------Orizontal negative------- //
                                                                // ------------------------------- //
                                                                if (rowIndexFirst == rowIndexLast) {

                                                                    console.log('Orizontal negative')

                                                                    let numberOfLetters = (colIndexFirst - colIndexLast) + 1

                                                                    //Adding the firt letter the word
                                                                    let word = matrix[rowIndexFirst][colIndexFirst]

                                                                    for (let i = (colIndexFirst) - 1; i > colIndexLast - 1; i--)
                                                                        word += `${matrix[rowIndexFirst][i]}`

                                                                    //check the word on the vocabulary
                                                                    API.getWordCheck(word).then((result) => {
                                                                        if (result) {

                                                                            //light on all the letters
                                                                            for (let i = firstPosition; i > lastPosition - 1; i--)
                                                                                props.handleBrightCells(i)
                                                                            handleNewWord(true);

                                                                            //Adding the score
                                                                            props.handleScore(numberOfLetters)

                                                                            //Adding the word to the words discovered list
                                                                            handleSelectedWords(firstLetter, lastLetter);
                                                                        }
                                                                    })
                                                                    handleFirstLetter(-1);
                                                                    handleLastLetter(-1);

                                                                    break game_logic;
                                                                }

                                                                // ------------------------------- //
                                                                // -------Vertical negative------- //
                                                                // ------------------------------- //
                                                                else if (colIndexFirst == colIndexLast) {

                                                                    console.log('Vertical negative')

                                                                    let numberOfLetters = (rowIndexFirst - rowIndexLast) + 1

                                                                    //Adding the firt letter the word
                                                                    let word = matrix[rowIndexFirst][colIndexFirst]

                                                                    for (let i = rowIndexFirst - 1; i > rowIndexLast - 1; i--) {
                                                                        word += `${matrix[i][colIndexFirst]}`
                                                                    }

                                                                    //check the word on the vocabulary
                                                                    API.getWordCheck(word).then((result) => {
                                                                        if (result) {

                                                                            //light on all the letters
                                                                            for (let i = firstPosition; i >= lastPosition; i = i - gridFactor)
                                                                                props.handleBrightCells(i)
                                                                            handleNewWord(true);

                                                                            //Adding the score
                                                                            props.handleScore(numberOfLetters)

                                                                            //Adding the word to the words discovered list
                                                                            handleSelectedWords(firstLetter, lastLetter);
                                                                        }
                                                                    })
                                                                    handleFirstLetter(-1);
                                                                    handleLastLetter(-1);

                                                                    break game_logic;
                                                                }

                                                                // ------------------------------- //
                                                                //-------Oblique negative(>)------ //
                                                                // ------------------------------- //
                                                                else if (rowIndexFirst > rowIndexLast && colIndexFirst < colIndexLast) {

                                                                    console.log('Oblique negative(>)')

                                                                    let numberOfLetters = (rowIndexFirst - rowIndexLast) + 1

                                                                    //The selection is not oblique
                                                                    if (colIndexLast != (colIndexFirst + numberOfLetters - 1)) {
                                                                        handleLastLetter(-1);
                                                                        break game_logic;;
                                                                    }

                                                                    //Adding the first letter to the word
                                                                    let word = matrix[rowIndexFirst][colIndexFirst]

                                                                    let colIndex = colIndexFirst + 1;

                                                                    for (let i = rowIndexFirst - 1; i > rowIndexLast - 1; i--) {
                                                                        word += `${matrix[i][colIndex]}`
                                                                        colIndex++;
                                                                    }

                                                                    //check the word on the vocabulary
                                                                    API.getWordCheck(word).then((result) => {
                                                                        if (result) {

                                                                            //light on all the letters
                                                                            let index = 0;
                                                                            for (let i = firstPosition; i >= lastPosition - gridFactor; i = i - gridFactor) {
                                                                                props.handleBrightCells(i + index)
                                                                                index++;
                                                                            }
                                                                            handleNewWord(true);

                                                                            //Adding the score
                                                                            props.handleScore(numberOfLetters)

                                                                            //Adding the word to the words discovered list
                                                                            handleSelectedWords(firstLetter, lastLetter);
                                                                        }
                                                                    })
                                                                    handleFirstLetter(-1);
                                                                    handleLastLetter(-1);

                                                                    break game_logic;
                                                                }

                                                                // ------------------------------- //
                                                                // -------Oblique negative(<)----- //
                                                                // ------------------------------- //
                                                                else if (rowIndexLast < rowIndexFirst && colIndexLast < colIndexFirst) {

                                                                    console.log('Oblique negative(<)')

                                                                    let numberOfLetters = (rowIndexFirst - rowIndexLast) + 1

                                                                    //The selection is not oblique
                                                                    if (colIndexLast != (colIndexFirst - (numberOfLetters - 1))) {
                                                                        handleLastLetter(-1);
                                                                        break;
                                                                    }

                                                                    //Adding the firt letter the word
                                                                    let word = matrix[rowIndexFirst][colIndexFirst]

                                                                    let colIndex = colIndexFirst - 1;

                                                                    for (let i = rowIndexFirst - 1; i > rowIndexLast - 1; i--) {
                                                                        word += `${matrix[i][colIndex]}`
                                                                        colIndex--;
                                                                    }

                                                                    //check the word on the vocabulary
                                                                    API.getWordCheck(word).then((result) => {
                                                                        if (result) {

                                                                            //light on all the letters
                                                                            let index = 0;
                                                                            for (let i = firstPosition; i >= lastPosition; i = i - gridFactor) {
                                                                                props.handleBrightCells(i + index)
                                                                                index--;
                                                                            }
                                                                            handleNewWord(true);

                                                                            //Adding the score
                                                                            props.handleScore(numberOfLetters)

                                                                            //Adding the word to the words discovered list
                                                                            handleSelectedWords(firstLetter, lastLetter);
                                                                        }
                                                                    })
                                                                    handleFirstLetter(-1);
                                                                    handleLastLetter(-1);

                                                                    break game_logic;
                                                                }
                                                        }
                                                    }
                                                }
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