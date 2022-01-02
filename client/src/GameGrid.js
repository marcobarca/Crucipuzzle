import { Card, FormControl, Col, Row, Figure, Image, Nav, Dropdown, DropdownButton, ButtonGroup, Container, Button } from 'react-bootstrap';
import * as Icons from 'react-bootstrap-icons';
import { Link } from 'react-router-dom';
import './grid.css'



function GameGrid(props) {
    //This matrix will be passed trough API from the server
    var matrix = [['A', 'B', 'C', 'D'], ['E', 'F', 'G', 'H'], ['I', 'L', 'M', 'N']];

    return (
        props.loading ? <h2 className='text-center'>Loading</h2> :
        <Figure className='p-2 external-frame'>
            {matrix.slice(0, matrix.length).map((innerMatrix, index) => {
                return (
                    <Row>
                        {innerMatrix.map((element) => {
                            return (
                                <Col>
                                    <Figure  key={matrix.indexOf(element)}>
                                        <div className={"frame text_image"}>
                                            <div style={{ color: `black` }}>
                                                {element}
                                            </div>
                                        </div>
                                    </Figure>
                                </Col>
                            )
                        })}
                    </Row>
                )
            })}
        </Figure>
    );

}


export { GameGrid };