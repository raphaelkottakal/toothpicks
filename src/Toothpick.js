import * as THREE from 'three';

const lenght = 32;
const width = 1;

class Toothpick {
  constructor(vectorPosition = new THREE.Vector3(0 ,0 , 0), zRotation = 0) {
    this.geometry = new THREE.CylinderBufferGeometry( width, width, lenght, 32 );
    // console.log(vectorPosition.length());
    this.material = new THREE.MeshBasicMaterial( {
      color: new THREE.Color( `hsl(${mapIt(vectorPosition.length(), 0, 720, 0, 360)}, 100%, 50%)` ),
      opacity: 0.75,
      transparent: true
    } );
    // this.material = new THREE.MeshBasicMaterial( {
    //   color: new THREE.Color(`hsl(${Math.random() * 360}, 100%, 0%)`),
    //   opacity: 1,
    //   transparent: true
    //   // wireframe: true
    // } );
    this.mesh = new THREE.Mesh( this.geometry, this.material );
    this.mesh.position.add(vectorPosition);
    this.zRotation = zRotation;
    if (zRotation > 0) {
      this.mesh.rotateZ(Math.PI / 2);
      this.pointA = vectorPosition.clone().sub(new THREE.Vector3(- lenght / 2 - width , 0, 0));
      this.pointB = vectorPosition.clone().sub(new THREE.Vector3(lenght / 2 + width, 0, 0));
    } else {
      this.pointA = vectorPosition.clone().sub(new THREE.Vector3(0, - lenght / 2 - width, 0));
      this.pointB = vectorPosition.clone().sub(new THREE.Vector3(0, lenght / 2 + width, 0));
      // this.pointA = vectorPosition.clone().sub(new THREE.Vector3(0, 0, - lenght / 2 - width));
      // this.pointB = vectorPosition.clone().sub(new THREE.Vector3(0, 0, lenght / 2 + width));
    }
  }
  addToScene(scene) {
    scene.add(this.mesh);
  }
  makeAtA(array1, array2) {
    const array = array1.concat(array2);
    let canMake = true;
    for(let i = 0; i < array.length; i++) {
      if (array[i].mesh.id === this.mesh.id) {
        continue;
      } else {
        if(this.pointA.equals(array[i].pointA) || this.pointA.equals(array[i].pointB)) {
          canMake = false;
        }
      }
    }
    if (canMake) {
      return new Toothpick(this.pointA, this.zRotation * -1);
    } else {
      return null;
    }
  }
  makeAtB(array1, array2) {
    const array = array1.concat(array2);
    let canMake = true;
    for(let i = 0; i < array.length; i++) {
      if (array[i].mesh.id === this.mesh.id) {
        continue;
      } else {
        if(this.pointB.equals(array[i].pointA) || this.pointB.equals(array[i].pointB)) {
          canMake = false;
        }
      }
    }
    if (canMake) {
      return new Toothpick(this.pointB, this.zRotation * -1);
    } else {
      return null;
    }
  }
}

function mapIt(n, start1, stop1, start2, stop2, withinBounds) {
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

export default Toothpick;