import * as React from "react"
import 'bootstrap/dist/css/bootstrap.min.css';
import { Navbar, Container, } from 'react-bootstrap';
import PPC from './photo_padding_control'
import "../style/page.css"
// styles

// markup
const IndexPage = () => {
    return (
        <>
            <Navbar bg="dark" variant="dark">
                <Container fluid>
                    <Navbar.Brand href="#home">
                        Photo Padding Pro
                    </Navbar.Brand>
                </Container>
            </Navbar>
            <br />
            <PPC />
        </>
    )
}

export default IndexPage
