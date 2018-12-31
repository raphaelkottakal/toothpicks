import React, { Component } from 'react';
import * as THREE from 'three';
import OrbitControls from 'three-orbitcontrols';

import Toothpick from './Toothpick';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.myRef = React.createRef();
  }
  componentDidMount() {
    this.createCanvas();
  }
  createCanvas() {
    let camera, scene, renderer, camControls;
    let firstPick;
    const domNode = this.myRef;
    let allToothpicks = [];
    let newGen = [];
    let nextGen = [];
    const totalGenerations = 52;

    init();
    // setTimeout(() => {
      animate();
      camControls = new OrbitControls(camera, renderer.domElement);
      // camControls.autoRotate = true;
      camControls.enablePan = false;
      camControls.minDistance = 25;
      camControls.maxDistance = 1000;
    // }, 0);

    function init() {
 
      camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.01, 5000 );
      // camera = new THREE.OrthographicCamera( window.innerWidth / - 2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / - 2, 1, 1000 );
      camera.position.z = 100;
      // camera.position.x = 500;
      
      scene = new THREE.Scene();
      
      renderer = new THREE.WebGLRenderer( { antialias: true, alpha: true } );
      renderer.setSize( window.innerWidth, window.innerHeight );
      renderer.setClearColor(0xffffff, 1);
      domNode.current.appendChild( renderer.domElement );
      // new OrbitControls(camera, renderer.domElement);

      var directionalLight = new THREE.DirectionalLight( 0xffffff, 1 );
      directionalLight.position.x = 10;
      directionalLight.position.y = 10;
      directionalLight.position.z = 10;
      // scene.add( directionalLight );
      
      firstPick = new Toothpick(new THREE.Vector3(0,0,0), -1);
      newGen.push(firstPick);
      firstPick.addToScene(scene);

      for(let i = 0; i < totalGenerations; i++) {
        nextGen = [];
        for(let j = 0; j < newGen.length; j++) {
          const newA = newGen[j].makeAtA(newGen, allToothpicks);
          const newB = newGen[j].makeAtB(newGen, allToothpicks);
          // console.log('new', newA, newB);
          if(newA) {
            newA.addToScene(scene);
            nextGen.push(newA);
          }
          if(newB) {
            newB.addToScene(scene);
            nextGen.push(newB);
          }
        }
        allToothpicks = allToothpicks.concat(newGen);
        newGen = nextGen.slice();
      }
      allToothpicks = allToothpicks.concat(nextGen);
      console.log(allToothpicks.length);

      // const nextTest = new Toothpick(new THREE.Vector3(0,32,0), 1);
      // console.log(testPick);
      // nextTest.addToScene(scene);
      renderer.render( scene, camera );
    }

    function onWindowResize() {
      // camera.left = window.innerWidth / - 2;
      // camera.right = window.innerWidth / 2;
      // camera.top = window.innerHeight / 2;
      // camera.bottom = window.innerHeight / - 2;
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
   
    function animate() {
    
        requestAnimationFrame( animate );
        for(let i = 0; i < allToothpicks.length; i++) {
          // allToothpicks[i].mesh.rotation.z += 0.01 + i * 0.0001;
          if (allToothpicks[i].zRotation > 0) {
            allToothpicks[i].mesh.rotation.y += 0.01;
            // allToothpicks[i].mesh.rotation.y += 0.01 + i * 0.0001;
          } else {
            allToothpicks[i].mesh.rotation.x += 0.01;
            // allToothpicks[i].mesh.rotation.x += 0.01 + i * 0.0001;
          }
        }
        if (camControls) {
          camControls.update();
        }

        // console.log(allToothpicks);
        renderer.render( scene, camera );
    
    }

    window.addEventListener('resize', onWindowResize, true);
  }

  makeFullscreen() {
    // const elem = document.body;
    // if (elem.requestFullscreen) {
    //   elem.requestFullscreen();
    // } else if (elem.mozRequestFullScreen) { /* Firefox */
    //   elem.mozRequestFullScreen();
    // } else if (elem.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
    //   elem.webkitRequestFullscreen();
    // } else if (elem.msRequestFullscreen) { /* IE/Edge */
    //   elem.msRequestFullscreen();
    // }
  }
  render() {
    return (
      <div onClick={this.makeFullscreen.bind(this)} ref={this.myRef}>
      </div>
    );
  }
}

export default App;
