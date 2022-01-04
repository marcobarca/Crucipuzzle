import { Card, FormControl, Col, Row, Figure, Image, Nav, Dropdown, DropdownButton, ButtonGroup, Container, Button } from 'react-bootstrap';
import * as Icons from 'react-bootstrap-icons';
import { Link } from 'react-router-dom';
import './grid.css'
import { useState, useEffect } from 'react';



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

    const [words, setWords] = useState([]);
    const handleWords = (words) => {
        setWords(words)
    }

    const [brightCells, setBrightCells] = useState([]);

    const handleBrightCells = (cell) => {
        let tmp = brightCells;
        tmp.push(cell)
        setBrightCells(tmp)
    }

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
            for (let i = 0; i < brightCells.length; i++)
                if (brightCells[i] == innerIndex + index * (props.gameDifficult * 6))
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

                                                //Select the LastLetter
                                                else if (firstLetter != -1 && firstLetter != (innerIndex + index * (props.gameDifficult * 6)) && lastLetter == -1) {
                                                    
                                                    handleLastLetter(innerIndex + index * (props.gameDifficult * 6))
                                                    /*
                                                    console.log('ciao')
                                                    console.log((~~((innerIndex + index * (props.gameDifficult * 6)) / 6)))
                                                    console.log((~~(firstLetter / 6)))
                                                    console.log('ciao')
                                                    console.log(matrix[1][1])
                                                    */

                                                    let gridFactor = props.gameDifficult * 6
                                                    let firstPosition = firstLetter;
                                                    let lastPosition = innerIndex + index * gridFactor;

                                                    let rowIndexFirst = ~~(firstPosition / gridFactor)
                                                    let colIndexFirst = firstPosition % gridFactor

                                                    let rowIndexLast = ~~(lastPosition / gridFactor)
                                                    let colIndexLast = lastPosition % gridFactor


                                                    //lastLetter > firstLetter (switch case)

                                                    switch (lastPosition > firstPosition) {

                                                        //lastLetter > firstLetter (Positive case)
                                                        case (true):

                                                            // ------------------------------- //
                                                            // ------Orizontal positive------- //
                                                            // ------------------------------- //
                                                            if (rowIndexFirst == rowIndexLast) {

                                                                let numberOfLetters = (firstPosition - lastPosition) + 1

                                                                //Adding the firt letter the word
                                                                let word = matrix[rowIndexFirst][colIndexFirst]

                                                                for (let i = (colIndexFirst) + 1; i < colIndexLast + 1; i++){
                                                                    word += `${matrix[rowIndexFirst][i]}`
                                                                    console.log(word)
                                                                }

                                                                alert(word)
                                                                //check the word on the vocabulary
                                                                //if valid go on else exit now

                                                                //light on all the letters
                                                                for (let i = firstPosition; i <= lastPosition; i++)
                                                                    handleBrightCells(i)

                                                                handleNewWord(true);

                                                                handleFirstLetter(-1);
                                                                handleLastLetter(-1);
                                                                break;
                                                            }
                                                            
                                                            // ------------------------------- //
                                                            // -------Vertical positive------- //
                                                            // ------------------------------- //
                                                            else if (colIndexFirst == colIndexLast) {


                                                                let numberOfLetters = (rowIndexLast - rowIndexFirst) + 1
                                                                
                                                                //Adding the firt letter the word
                                                                let word = matrix[rowIndexFirst][colIndexFirst]

                                                                for(let i=rowIndexFirst + 1; i < rowIndexLast + 1; i++){
                                                                    console.log(i)
                                                                    word += `${matrix[i][colIndexFirst]}`
                                                                }
                                                                alert(word)

                                                                //check the word on the vocabulary
                                                                //if valid go on else exit now

                                                                //light on all the letters                                                               
                                                                for (let i = firstPosition; i <= lastPosition; i = i+gridFactor){
                                                                    console.log(i)
                                                                    handleBrightCells(i)
                                                                }
                                                                handleNewWord(true);

                                                                handleFirstLetter(-1);
                                                                handleLastLetter(-1);
                                                                break;
                                                            }

                                                            // ------------------------------- //
                                                            //-------Oblique positive(>)------ //
                                                            // ------------------------------- //
                                                            else if (rowIndexLast > rowIndexFirst && colIndexLast > colIndexFirst) {
                                                                let numberOfLetters = (rowIndexLast - rowIndexFirst) + 1

                                                                //The selection is not oblique
                                                                if(colIndexLast != (colIndexFirst + numberOfLetters - 1)){
                                                                    handleLastLetter(-1);
                                                                    break;
                                                                }
                                                                
                                                                //Adding the firt letter the word
                                                                let word = matrix[rowIndexFirst][colIndexFirst]

                                                                let colIndex = colIndexFirst + 1;

                                                                for(let i=rowIndexFirst + 1; i < rowIndexLast + 1; i++){
                                                                    console.log(i)
                                                                    word += `${matrix[i][colIndex]}`
                                                                    colIndex++;
                                                                }
                                                                alert(word)

                                                                //check the word on the vocabulary
                                                                //if valid go on else exit now

                                                                //light on all the letters
                                                                let index = 0;

                                                                for (let i = firstPosition; i <= lastPosition; i = i+gridFactor){
                                                                    console.log(i)
                                                                    handleBrightCells(i + index)
                                                                    index++;
                                                                }

                                                                handleNewWord(true);

                                                                handleFirstLetter(-1);
                                                                handleLastLetter(-1);
                                                                break;
                                                            }

                                                            // ------------------------------- //
                                                            // -------Oblique positive(<)----- //
                                                            // ------------------------------- //
                                                            else if (rowIndexLast > rowIndexFirst && colIndexLast < colIndexFirst ) {
                                                                let numberOfLetters = (rowIndexLast - rowIndexFirst) + 1

                                                                //The selection is not oblique
                                                                if(colIndexLast != (colIndexFirst - (numberOfLetters - 1))){
                                                                    handleLastLetter(-1);
                                                                    break;
                                                                }
                                                                
                                                                //Adding the firt letter the word
                                                                let word = matrix[rowIndexFirst][colIndexFirst]

                                                                let colIndex = colIndexFirst - 1;

                                                                for(let i=rowIndexFirst + 1; i < rowIndexLast + 1; i++){
                                                                    console.log(i)
                                                                    word += `${matrix[i][colIndex]}`
                                                                    colIndex--;
                                                                }
                                                                alert(word)

                                                                //check the word on the vocabulary
                                                                //if valid go on else exit now

                                                                //light on all the letters
                                                                let index = 0;

                                                                for (let i = firstPosition; i <= lastPosition + gridFactor; i = i+gridFactor){
                                                                    console.log(i)
                                                                    handleBrightCells(i + index)
                                                                    index--;
                                                                }

                                                                handleNewWord(true);

                                                                handleFirstLetter(-1);
                                                                handleLastLetter(-1);
                                                                break;
                                                            }
                                                        
                                                        //---------------------------------------------------------------------------------------------------------
                                                        //lastLetter < firstLetter (negative case)
                                                        case (false):
                                                            // ------------------------------- //
                                                            // ------Orizontal negative------- //
                                                            // ------------------------------- //
                                                            if (rowIndexFirst == rowIndexLast) {
                                                                let numberOfLetters = (lastPosition - firstPosition) + 1

                                                                //Adding the firt letter the word
                                                                let word = matrix[rowIndexFirst][colIndexFirst]

                                                                for (let i = (colIndexFirst) - 1; i > colIndexLast; i--)
                                                                    word += `${matrix[rowIndexFirst][i]}`
                                                                
                                                                alert(word)
                                                                //check the word on the vocabulary
                                                                //if valid go on else exit now

                                                                //light on all the letters
                                                                for (let i = firstPosition; i > lastPosition; i--)
                                                                    handleBrightCells(i)

                                                                handleNewWord(true);

                                                                handleFirstLetter(-1);
                                                                handleLastLetter(-1);
                                                                break;
                                                            }
                                                            
                                                            // ------------------------------- //
                                                            // -------Vertical positive------- //
                                                            // ------------------------------- //
                                                            else if (colIndexFirst == colIndexLast) {

                                                                let numberOfLetters = (rowIndexLast - rowIndexFirst) + 1
                                                                
                                                                //Adding the firt letter the word
                                                                let word = matrix[rowIndexFirst][colIndexFirst]

                                                                for(let i=rowIndexFirst + 1; i < rowIndexLast + 1; i++){
                                                                    console.log(i)
                                                                    word += `${matrix[i][colIndexFirst]}`
                                                                }
                                                                alert(word)

                                                                //check the word on the vocabulary
                                                                //if valid go on else exit now

                                                                //light on all the letters
                                                                console.log('hello')
                                                                console.log(lastPosition)
                                                                console.log('hello')
                                                                
                                                                for (let i = firstPosition; i <= lastPosition; i = i+gridFactor){
                                                                    console.log(i)
                                                                    handleBrightCells(i)
                                                                }

                                                                console.log('yooo')

                                                                handleNewWord(true);

                                                                handleFirstLetter(-1);
                                                                handleLastLetter(-1);
                                                                break;
                                                            }

                                                            // ------------------------------- //
                                                            //-------Oblique positive(>)------ //
                                                            // ------------------------------- //
                                                            else if (rowIndexLast > rowIndexFirst && colIndexLast > colIndexFirst) {
                                                                let numberOfLetters = (rowIndexLast - rowIndexFirst) + 1

                                                                //The selection is not oblique
                                                                if(colIndexLast != (colIndexFirst + numberOfLetters - 1)){
                                                                    handleLastLetter(-1);
                                                                    break;
                                                                }
                                                                
                                                                //Adding the firt letter the word
                                                                let word = matrix[rowIndexFirst][colIndexFirst]

                                                                let colIndex = colIndexFirst + 1;

                                                                for(let i=rowIndexFirst + 1; i < rowIndexLast + 1; i++){
                                                                    console.log(i)
                                                                    word += `${matrix[i][colIndex]}`
                                                                    colIndex++;
                                                                }
                                                                alert(word)

                                                                //check the word on the vocabulary
                                                                //if valid go on else exit now

                                                                //light on all the letters
                                                                console.log('hello')
                                                                console.log(lastPosition)
                                                                console.log('hello')
                                                                
                                                                let index = 0;

                                                                for (let i = firstPosition; i <= lastPosition; i = i+gridFactor){
                                                                    console.log(i)
                                                                    handleBrightCells(i + index)
                                                                    index++;
                                                                }

                                                                console.log('yooo')

                                                                handleNewWord(true);

                                                                handleFirstLetter(-1);
                                                                handleLastLetter(-1);
                                                                break;
                                                            }

                                                            // ------------------------------- //
                                                            // -------Oblique positive(<)----- //
                                                            // ------------------------------- //
                                                            else if (rowIndexLast > rowIndexFirst && colIndexLast < colIndexFirst ) {
                                                                let numberOfLetters = (rowIndexLast - rowIndexFirst) + 1

                                                                //The selection is not oblique
                                                                if(colIndexLast != (colIndexFirst - (numberOfLetters - 1))){
                                                                    handleLastLetter(-1);
                                                                    break;
                                                                }
                                                                
                                                                //Adding the firt letter the word
                                                                let word = matrix[rowIndexFirst][colIndexFirst]

                                                                let colIndex = colIndexFirst - 1;

                                                                for(let i=rowIndexFirst + 1; i < rowIndexLast + 1; i++){
                                                                    console.log(i)
                                                                    word += `${matrix[i][colIndex]}`
                                                                    colIndex--;
                                                                }
                                                                alert(word)

                                                                //check the word on the vocabulary
                                                                //if valid go on else exit now

                                                                //light on all the letters
                                                                console.log('hello')
                                                                console.log(lastPosition)
                                                                console.log('hello')
                                                                
                                                                let index = 0;

                                                                for (let i = firstPosition; i <= lastPosition + gridFactor; i = i+gridFactor){
                                                                    console.log(i)
                                                                    handleBrightCells(i + index)
                                                                    index--;
                                                                }

                                                                console.log('yooo')

                                                                handleNewWord(true);

                                                                handleFirstLetter(-1);
                                                                handleLastLetter(-1);
                                                                break;
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