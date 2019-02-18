import React, { Component } from 'react';
import * as THREE from 'three';
import OrbitControls from 'three-orbitcontrols';

import Toothpick from './Toothpick';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.myRef = React.createRef();
    this.allToothpicks = [];
    //move all top lvl variable here
  }
  componentDidMount() {
    this.createCanvas();
  }

  makeToothpickGenerations(n) {
    let allToothpicks = [];
    let newGen = [];
    let nextGen = [];
    const firstPick = new Toothpick(new THREE.Vector3(0,0,0), -1);
    newGen.push(firstPick);
    for(let i = 0; i < n; i++) {
      nextGen = [];
      for(let j = 0; j < newGen.length; j++) {
        const newA = newGen[j].makeAtA(newGen, allToothpicks);
        const newB = newGen[j].makeAtB(newGen, allToothpicks);
        // console.log('new', newA, newB);
        if(newA) {
          // newA.addToScene(scene);
          nextGen.push(newA);
        }
        if(newB) {
          // newB.addToScene(scene);
          nextGen.push(newB);
        }
      }
      allToothpicks = allToothpicks.concat(newGen);
      newGen = nextGen.slice();
    }
    allToothpicks = allToothpicks.concat(nextGen);
    return allToothpicks; //an array of Toothpicks
  }

  renderToothpicks(toothpicks, scene) {
    for (let i = 0; i < toothpicks.length; i++) {
      const toothpick = toothpicks[i];
      toothpick.addToScene(scene);
    }
  }

  clearAllToothpicks(scene) {
    let { allToothpicks } = this;
    console.log(allToothpicks, scene);
    for (let i = 0; i < allToothpicks.length; i++) {
      const toothpick = allToothpicks[i];
      scene.remove(toothpick.mesh);
      toothpick.mesh.geometry.dispose();
      toothpick.mesh.material.dispose();
      toothpick.mesh = undefined;
    }
    allToothpicks = [];
  }

  animateToothpicks(allToothpicks) {
    const { mapIt } = this;
    for(let i = 0; i < allToothpicks.length; i++) {
      // allToothpicks[i].mesh.rotation.z += 0.01 + i * 0.0001;
      const distanceToOrigin = allToothpicks[i].mesh.position.length();
      if (allToothpicks[i].zRotation > 0) {
        allToothpicks[i].mesh.rotation.y += mapIt(distanceToOrigin, 0, allToothpicks[allToothpicks.length - 1].mesh.position.length(), 0.01, 0.05);
        // allToothpicks[i].mesh.rotation.y += 0.01 + i * 0.0001;
      } else {
        allToothpicks[i].mesh.rotation.x -= mapIt(distanceToOrigin, 0, allToothpicks[allToothpicks.length - 1].mesh.position.length(), 0.01, 0.05);
        // allToothpicks[i].mesh.rotation.x += 0.01 + i * 0.0001;
      }
    }
  }

  createCanvas() {
    let camera, scene, renderer, camControls;
    const {
      renderToothpicks,
      makeToothpickGenerations
    } = this;
    let {
      allToothpicks
    } = this;
    const domNode = this.myRef;
    allToothpicks = makeToothpickGenerations(2);    
 
    camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.01, 5000 );
    // camera = new THREE.OrthographicCamera( window.innerWidth / - 2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / - 2, 1, 1000 );
    camera.position.z = 100;
    // camera.position.x = 500;
    
    scene = new THREE.Scene();
    
    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setSize( window.innerWidth, window.innerHeight );
    // renderer.setClearColor(0xffffff, 1);
    domNode.current.appendChild( renderer.domElement );
    // new OrbitControls(camera, renderer.domElement);
    
    var light = new THREE.HemisphereLight( 0xffffbb, 0x080820, 1 );
    scene.add( light );
    
    renderToothpicks(allToothpicks, scene);
    renderer.render( scene, camera );
    
    camControls = new OrbitControls(camera, renderer.domElement);
    camControls.enablePan = false;
    camControls.minDistance = 25;
    camControls.maxDistance = 2000;
    
    const animate = () => {
      
      requestAnimationFrame( animate );
      // for(let i = 0; i < allToothpicks.length; i++) {
      //   // allToothpicks[i].mesh.rotation.z += 0.01 + i * 0.0001;
      //   const distanceToOrigin = allToothpicks[i].mesh.position.length();
      //   if (allToothpicks[i].zRotation > 0) {
      //     allToothpicks[i].mesh.rotation.y += mapIt(distanceToOrigin, 0, allToothpicks[allToothpicks.length - 1].mesh.position.length(), 0.01, 0.05);
      //     // allToothpicks[i].mesh.rotation.y += 0.01 + i * 0.0001;
      //   } else {
      //     allToothpicks[i].mesh.rotation.x -= mapIt(distanceToOrigin, 0, allToothpicks[allToothpicks.length - 1].mesh.position.length(), 0.01, 0.05);
      //     // allToothpicks[i].mesh.rotation.x += 0.01 + i * 0.0001;
      //   }
      // }
      this.animateToothpicks(allToothpicks);
      renderer.render( scene, camera );
    }
    animate();
    
    
    const onWindowResize = () => {
      console.log();
      this.clearAllToothpicks(allToothpicks, scene);
      // camera.left = window.innerWidth / - 2;
      // camera.right = window.innerWidth / 2;
      // camera.top = window.innerHeight / 2;
      // camera.bottom = window.innerHeight / - 2;
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', onWindowResize, true);
  }

  mapIt(n, start1, stop1, start2, stop2, withinBounds) {
    var newval = (n - start1) / (stop1 - start1) * (stop2 - start2) + start2;
    if (!withinBounds) {
      return newval;
    }
    if (start2 < stop2) {
      return this.constrain(newval, start2, stop2);
    } else {
      return this.constrain(newval, stop2, start2);
    }
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
