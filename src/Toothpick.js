import * as THREE from 'three';

const lenght = 32;

class Toothpick {
  constructor(vectorPosition = new THREE.Vector3(0 ,0 , 0), zRotation = 0) {
    this.geometry = new THREE.CylinderBufferGeometry( 1, 1, lenght, 32 );
    // this.material = new THREE.MeshPhongMaterial( {color: new THREE.Color( Math.random(), Math.random(), Math.random() )} );
    this.material = new THREE.MeshBasicMaterial( {color: new THREE.Color( Math.random(), Math.random(), Math.random() )} );
    this.mesh = new THREE.Mesh( this.geometry, this.material );
    this.mesh.position.add(vectorPosition);
    this.zRotation = zRotation;
    if (zRotation > 0) {
      this.mesh.rotateZ(Math.PI / 2);
      this.pointA = vectorPosition.clone().sub(new THREE.Vector3(- lenght / 2, 0, 0));
      this.pointB = vectorPosition.clone().sub(new THREE.Vector3(lenght / 2, 0, 0));
    } else {
      this.pointA = vectorPosition.clone().sub(new THREE.Vector3(0, - lenght / 2, 0));
      this.pointB = vectorPosition.clone().sub(new THREE.Vector3(0, lenght / 2, 0));
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

export default Toothpick;