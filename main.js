import './style.css'

import * as THREE from 'three';

import { OrbitControls } from "three/addons/controls/OrbitControls.js";

const scene = new THREE.Scene();

const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('#bg'),
});

const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( window.innerWidth, window.innerHeight );

// incorrect placement on page load
//camera.position.setZ(30);

renderer.render( scene, camera );

const geometry = new THREE.TorusGeometry( 10, 3, 16, 100 );
const material = new THREE.MeshStandardMaterial( { color: 0x140228,  } );
const torus = new THREE.Mesh( geometry, material );

const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(20, 20, 20);

const ambientLight = new THREE.AmbientLight(0xffffff);

scene.add(pointLight, ambientLight);

const controls = new OrbitControls(camera, renderer.domElement);

function addStar() {
    const geometry = new THREE.SphereGeometry(0.25, 24, 24);
    const material = new THREE.MeshStandardMaterial( { color: 0xffffff } );
    const star = new THREE.Mesh( geometry, material );

    const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread( 100 ) );

    star.position.set(x, y, z);
    scene.add(star);
}

Array(200).fill().forEach(addStar);

const spaceTexture = new THREE.TextureLoader().load('images/xcat-bg.png');
scene.background = spaceTexture;

const objTexture = new THREE.TextureLoader().load('images/bigdata.png');

const obj = new THREE.Mesh(
    new THREE.BoxGeometry(1,1,1),
    new THREE.MeshBasicMaterial( { map: objTexture } )
);

const sphereTexture = new THREE.TextureLoader().load('images/cat-1.jpg');

// Normal map
const sphereNormal = new THREE.TextureLoader().load('');

const sphereCat = new THREE.Mesh(
    new THREE.SphereGeometry(3, 32, 32),
    new THREE.MeshStandardMaterial( {
        map: sphereTexture,
        normalMap: sphereNormal
    } )
);

scene.add(obj);

//scene.add(sphereCat);
//scene.add(torus)

obj.position.z = -10;
obj.position.setX(3);
obj.position.setY(-5);

function moveCamera() {
    const t = document.body.getBoundingClientRect().top;
    sphereCat.rotation.x += 0.05;
    sphereCat.rotation.y += 0.075;
    sphereCat.rotation.z += 0.05;

    obj.rotation.y += 0.01;
    obj.rotation.z += 0.01;

    camera.position.z = t * -0.01;
    camera.position.x = t * -0.0002;
    camera.position.y = t * -0.0002;
}

document.body.onscroll = moveCamera;

function animate() {
    requestAnimationFrame( animate );

    torus.rotation.x += 0.01;
    torus.rotation.y += 0.005;
    torus.rotation.z += 0.01;

    controls.update();

    renderer.render( scene, camera );

}

animate();
