import React, { Component } from "react";
import ReactDOM from "react-dom";
import * as THREE from "three";
import { MathUtils } from "three";

class Home extends Component {
  componentDidMount() {
    const { GLTFLoader } = require("three/examples/jsm/loaders/GLTFLoader");
    var mixer;
    var clock = new THREE.Clock();

    // setup scene, camera, etc
    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    var renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    this.mount.appendChild(renderer.domElement);

    camera.position.setZ(0);
    camera.position.setX(0);
    camera.position.setY(0);

    renderer.setClearColor("#0E0D30");

    // setup light

    const ambientlighting = new THREE.AmbientLight(0xffffff);
    scene.add(ambientlighting);

    // objects in scene

    const spawnStar = () => {
      const star = new THREE.Mesh(
        new THREE.SphereGeometry(MathUtils.randFloat(0.5, 1), 24, 24),
        new THREE.MeshStandardMaterial({
          color: 0xffffff,
          roughness: 0.1,
          metalness: 0.1,
        })
      );

      const [x, y, z] = Array(3)
        .fill()
        .map(() => MathUtils.randFloatSpread(400));
      star.position.set(x, y, z);
      scene.add(star);
    };

    Array(400).fill().forEach(spawnStar);

    const loader = new GLTFLoader();
    loader.load("./space.glb", (gltf) => {
      const planets = gltf.scene;
    
      planets.position.set(0, -10, -10);
      planets.rotateY(10);

      mixer = new THREE.AnimationMixer(planets);

      gltf.animations.forEach((clip) => {
        mixer.clipAction(clip).play();
      });

      scene.add(planets);
    });


    // camera movement, window resizing, animation

    const moveCamera = () => {
      const top = document.body.getBoundingClientRect().top;

      camera.position.z = top * -0.04;
      camera.position.x = top * -0.001;
      camera.rotation.y = top * -0.0002;

      //   console.log(camera.position)
    };

    document.body.onscroll = moveCamera;
    moveCamera();

    const resizeCanvas = () => {
      renderer.setSize(window.innerWidth, window.innerHeight + 10);
      renderer.setPixelRatio(window.devicePixelRatio);
    };

    window.onresize = resizeCanvas;

    var animate = function () {
      requestAnimationFrame(animate);

      var delta = clock.getDelta();
      if (mixer) mixer.update(delta / 3);

      renderer.render(scene, camera);
    };
    animate();
  }
  render() {
    return <div classname={"bg"} ref={(ref) => (this.mount = ref)} />;
  }
}

export default Home;
