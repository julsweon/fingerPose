// 1. install dependencies (npm install @tensorflow/tfjs @tensorflow-models/handpose react-webcam)
// 2. Import dependencies (import {useRef}, 
  /* import * as tf from "@tensorflow/tfjs";
  import * as handpose from "@tensorflow-models/handpose";
  import Webcam from "react-webcam";)*/
// 3. Setup wecam and canvas
// 4. Define references to those
// 5. Load handpose
// 6. detect function (detect hand)
// 7. drawing utilities from tf



import logo, {useRef} from 'react';
//from './logo.svg';
import * as tf from "@tensorflow/tfjs";
import * as handpose from "@tensorflow-models/handpose";
import Webcam from "react-webcam";
import './App.css';
import {drawHand} from "./utilities";
function App() {
  const webcamRef= useRef(null);
  const canvasRef = useRef(null);

  const runHandpose = async() =>{
    const net = await handpose.load() //make async -> wait for it to load
    console.log("handpose model loaded");

    //loop - constantly detect hands within our frame
    setInterval(() => {
      detect(net)
    }, 100)
  };

  //passing handpose model from runHandpose to detect function
  const detect = async (net) => {
    // check data is available (is video properly stramed)
    if (
      typeof webcamRef.current !== "undefined" &&
      webcamRef.current !== null &&
      webcamRef.current.video.readyState === 4
    ) { 
      // get video properties
      const video = webcamRef.current.video; //grab webcamRef h,w
      const videoWidth = webcamRef.current.video.videoWidth;
      const videoHeight = webcamRef.current.video.videoHeight;

      // set video h,w
      webcamRef.current.video.width = videoWidth; 
      webcamRef.current.video.height = videoHeight;

      // set canvas h,w
      canvasRef.current.width = videoWidth;
      canvasRef.current.height = videoHeight;

      // make detection using neural network above (net)
      const hand = await net.estimateHands(video); //grab neural network and use estimateHands method to estimate hand within video frame
      console.log(hand); //annotation, whether or not hand exists in the frame, etc.


      // draw mesh
      const ctx = canvasRef.current.getContext("2d");
      drawHand(hand, ctx);
    }


    
    
 
    // draw mesh

  }

  runHandpose();

  return (
    <div className="App">
      <header className="App-header">
        <Webcam ref={webcamRef}
        //in-line styling
        style= {{
          position:"absolute",
          marginLeft:"auto",
          marginRight:"auto",
          left:0,
          right:0,
          textAlign:"center",
          zindex:9,
          width: 640,
          height:480,
        }}/>
        <canvas ref={canvasRef}
        style={{
          position:"absolute",
          marginLeft:"auto",
          marginRight:"auto",
          left:0,
          right:0,
          textAlign:"center",
          zindex:9,
          width: 640,
          height:480,
        }}/>
      </header>
    </div>
  );
}

export default App;
