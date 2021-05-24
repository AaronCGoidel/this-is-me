import React, { Component } from "react";
import ReactDOM from "react-dom";
import * as THREE from "three";
import { MathUtils } from "three";

class Home extends Component {
  componentDidMount() {
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

    camera.position.setZ(30);
    camera.position.setX(-3);

    renderer.setClearColor("#17164d");

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
      console.log("here");
      scene.add(star);
    };

    Array(400).fill().forEach(spawnStar);

    const aaronPic = new THREE.TextureLoader().load("acg.png");

    const me = new THREE.Mesh(
      new THREE.BoxGeometry(4, 4, 4),
      new THREE.MeshBasicMaterial({ map: aaronPic })
    );
    
    me.position.set(10, 0, -10)
    scene.add(me);

    // camera movement, window resizing, animation

    const moveCamera = () => {
      const top = document.body.getBoundingClientRect().top;

      camera.position.z = top * -0.04;
      camera.position.x = top * -0.002;
      camera.rotation.y = top * -0.0002;
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
    me.rotation.y += .005;
    me.rotation.z +=.001;
      renderer.render(scene, camera);
    };
    animate();
  }
  render() {
    return <div classname={"bg"} ref={(ref) => (this.mount = ref)} />;
  }
}

export default Home;
