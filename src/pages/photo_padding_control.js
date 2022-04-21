import React, { useRef } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Container, Row, Col, Form } from 'react-bootstrap';
import "../style/page.css"
import { useState } from 'react';
import Dropzone from 'react-dropzone'
import { DeleteForever } from '@mui/icons-material';



const RmBtn = (props) => {
    if (!props.uploaded) return <></>
    return <Button size="sm" variant="danger" onClick={() => { props.setUploaded(false) }}><DeleteForever /></Button>
}

const Preview = ({ uploaded, setUploaded, canvasProps }) => {
    const [imgUrl, setImgUrl] = useState(null)
    const canvas = useRef(null)
    if (!uploaded) {
        return (
            <Dropzone accept="image/*" onDrop={acceptedFiles => {
                console.log(acceptedFiles)
                const img = acceptedFiles[0]
                const reader = new FileReader()
                reader.readAsDataURL(img)
                reader.onload = (e) => {
                    setUploaded(true)
                    setImgUrl(e.target.result)
                }
            }}>
                {({ getRootProps, getInputProps }) => (
                    <div {...getRootProps()} style={{
                        border: "dashed 1px #0f0",
                        padding: "10px",
                        minHeight: "50vh",
                        textAlign: "center",
                    }}>
                        <input {...getInputProps()} />
                        <br />
                        <p>drop your photo here or click to select file.</p>
                    </div>
                )}
            </Dropzone>
        );
    }

    const targetWidth = canvasProps.targetWidth
    const targetHeight = canvasProps.targetHeight
    // TODO passing props here
    const targetRatio = targetWidth / targetHeight

    let img = new Image(); // Creates image object
    img.src = imgUrl; // Assigns converted image to image object
    img.onload = function (e) {
        const coverRatio = Math.max(targetWidth / img.width, targetHeight / img.height)
        const fitRatio = Math.min(targetWidth / img.width, targetHeight / img.height)
        const coverWidth = ~~(img.width * coverRatio), coverHeight = ~~(img.height * coverRatio)
        const fitWidth = ~~(img.width * fitRatio), fitHeight = ~~(img.height * fitRatio)
        const coverTop = ~~((coverHeight - targetHeight) / 2), coverLeft = ~~((coverWidth - targetWidth) / 2)
        const fitTop = ~~((targetHeight - fitHeight) / 2), fitLeft = ~~((targetWidth - fitWidth) / 2)

        let myCanvas = canvas.current;          // Creates a canvas object
        let ctx = myCanvas.getContext("2d");    // Creates a contect object
        myCanvas.width = targetWidth;           // Assigns image's width to canvas
        myCanvas.height = targetHeight;         // Assigns image's height to canvas
        ctx.filter = `blur(${canvasProps.blurRadius}px) brightness(${canvasProps.bgBrightness})`;
        ctx.drawImage(img,
            coverLeft / coverRatio, coverTop / coverRatio,
            coverWidth / coverRatio, coverHeight / coverRatio,
            -canvasProps.blurRadius, -canvasProps.blurRadius,
            targetWidth + coverLeft + canvasProps.blurRadius * 2, targetHeight + coverTop + canvasProps.blurRadius * 2);
        ctx.filter = 'none'
        ctx.drawImage(img, 0, 0, img.width, img.height, fitLeft, fitTop, fitWidth, fitHeight);
        console.log(fitLeft, fitTop, targetWidth - fitLeft, targetHeight - fitTop)
    }


    return <>
        <canvas style={{ maxWidth: "100%", maxHeight: "70vh", display: "block", margin: "auto" }} ref={canvas}></canvas>
    </>

}
export default () => {
    const [uploaded, setUploaded] = useState(false)
    const [targetHeight, setTargetHeight] = useState(2500)
    const [targetWidth, setTargetWidth] = useState(2000)
    const [bgBrightness, setBgBrightness] = useState(0.3)
    const [blurRadius, setblurRadius] = useState(10)

    return (
        <Container>
            <Row>
                <Col>
                    <h4>Please upload your photo <RmBtn uploaded={uploaded} setUploaded={setUploaded}></RmBtn></h4>
                </Col>
            </Row>
            <br />
            <Row>
                <Col md="9" xs="12">
                    <Preview uploaded={uploaded} setUploaded={setUploaded} canvasProps={{
                        targetHeight: Math.min(targetHeight, 5000),
                        targetWidth: Math.min(targetWidth, 5000),
                        bgBrightness: bgBrightness,
                        blurRadius: blurRadius
                    }} />
                </Col>
                <Col md="3" xs="12">
                    <Form.Label>Width</Form.Label>
                    <Form.Control type="number" max={5000} min={500} defaultValue={targetWidth} onChange={e => setTargetWidth(e.target.value)} placeholder="width" />
                    <br />
                    <Form.Label>Height</Form.Label>
                    <Form.Control type="number" max={5000} min={500} defaultValue={targetHeight} onChange={e => setTargetHeight(e.target.value)} placeholder="height" />
                    <br />
                    <Form.Label>Blur ({blurRadius}px)</Form.Label>
                    <Form.Range min={0} max={50} defaultValue={blurRadius} onChange={e => setblurRadius(e.target.value)} />
                    <br />
                    <Form.Label>Background Brightness ({bgBrightness})</Form.Label>
                    <Form.Range min={0} max={2} step={0.01} defaultValue={bgBrightness} onChange={e => setBgBrightness(e.target.value)} />

                </Col>
            </Row>
        </Container>
    )
}