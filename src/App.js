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
    let camera, scene, renderer;
    let firstPick;
    const domNode = this.myRef;
    let allToothpicks = [];
    let newGen = [];
    let nextGen = [];
    const totalGenerations = 20;

    init();
    animate();

    function init() {
 
      camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.01, 1000 );
      // camera = new THREE.OrthographicCamera( window.innerWidth / - 2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / - 2, 1, 1000 );
      camera.position.z = 500;
      // camera.position.x = 500;
      
      scene = new THREE.Scene();
      
      renderer = new THREE.WebGLRenderer( { antialias: true } );
      renderer.setSize( window.innerWidth, window.innerHeight );
      domNode.current.appendChild( renderer.domElement );
      new OrbitControls(camera, renderer.domElement);

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

      // const nextTest = new Toothpick(new THREE.Vector3(0,32,0), 1);
      // console.log(testPick);
      // nextTest.addToScene(scene);
    }
   
    function animate() {
    
        requestAnimationFrame( animate );
        for(let i = 0; i < allToothpicks.length; i++) {
          // allToothpicks[i].mesh.rotation.z += 0.01 + i * 0.0001;
          if (allToothpicks[i].zRotation > 0) {
            allToothpicks[i].mesh.rotation.y += 0.01 + i * 0.0001;
          } else {
            allToothpicks[i].mesh.rotation.x += 0.01 + i * 0.0001;
          }
        }
        // console.log(allToothpicks);
        renderer.render( scene, camera );
    
    }
  }
  render() {
    return (
      <div ref={this.myRef}>
      </div>
    );
  }
}

export default App;
