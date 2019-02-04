import Auth from '@aws-amplify/auth';
import Amplify from 'aws-amplify';
import awsconfig from './aws-exports';
import aws_exports from './aws-exports';

import { XR as AwsXR } from 'aws-amplify';
import scene1Config from './sumerian_exports';

Amplify.configure(aws_exports);

Auth.configure(awsconfig);

AwsXR.configure({
  SumerianProvider: {
    region: 'ca-central-1', // Sumerian region
    scenes: {
      "are": { // Friendly scene name
        sceneConfig: scene1Config // Scene configuration from Sumerian publish
      }
    },
  }
});

async function loadAndStartScene() {

	   const progressCallback = (progress) => {
        console.log(`Sumerian scene load progress: ${progress * 100}%`);
    }

    const sceneOptions = {
        progressCallback
    }
    
  await AwsXR.loadScene("are", "sumerian-scene-dom-id",sceneOptions)
  //  AwsXR.start("are");
 
  const world = AwsXR.getSceneController('are').sumerianRunner.world
  window.sumerian.SystemBus.addListener('xrready', () => {
    console.log("test")
    // Both Sumerian scene and camera have loaded. Dismiss loading screen.
    const loadBackground = document.getElementById('loadBackground')
    loadBackground.classList.add('fade-out')
    setTimeout(function () {
      return loadBackground && loadBackground.parentNode && loadBackground.parentNode.removeChild(loadBackground);
    }, 1000);
  })
  window.sumerian.SystemBus.addListener('xrerror', (params) => {
    // Dismiss loading screen and display error
  })
 // window.XR.Sumerian.addXRWebSystem(world)

  const handleClickEvent = (e) => {
    if (!e.touches || e.touches.length < 2) {
      return;
    }
    if (e.touches.length == 2) {
      window.sumerian.SystemBus.emit('recenter')
    }
  }

  const sumerianContainer = document.getElementById('sumerian-app')
  if (sumerianContainer) {
    sumerianContainer.addEventListener('touchstart', handleClickEvent, true)
  }

  AwsXR.start("are")
}

window.onload = () => {

	 //loadAndStartScene()
  if (window.XR) {
    loadAndStartScene()
  } else {
    window.addEventListener('xrloaded', loadAndStartScene)
  }
}