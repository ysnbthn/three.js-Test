import * as THREE from "three";
import "./style.css";
import gsap from "gsap";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

// SAHNE - Kamera, objeler, ışık, vs. hepsi buraya EKLENMEK ZORUNDA
const scene = new THREE.Scene();

// oyun hamuru gibi düşün bu şekli
const geometry = new THREE.SphereGeometry(3, 64, 64); // radius, width segment, height segment
// buda içindeki malzeme
const material = new THREE.MeshStandardMaterial({
  color: "#00ff83",
  roughness: 0.5,
});
// buda üstteki ikisinin birleştirilmiş hali
const mesh = new THREE.Mesh(geometry, material);
// yaptığın şeyi sahneye ekle
scene.add(mesh);

// Sizes
const sizes = {
  width: window.innerWidth,
  heigth: window.innerHeight,
};

// Işık - objeyi görebilmen için ona ışık tutman lazım
const light = new THREE.PointLight(0xffffff, 125, 100); // renk, yoğunluğu, uzaklığı
light.position.set(0, 10, 10); // x,y,z
scene.add(light);

// Camera - Kullanıcı ekranı nerden nasıl görecek - Çok büyük olursa görüşte uçlara doğru kayma (sündürme/bozulma) olabilir
const camera = new THREE.PerspectiveCamera(
  45,
  sizes.width / sizes.heigth,
  0.1,
  100
); // Field of view(FOV), aspect ratio, en yakın render mesafesi, en uzak render mesafesi (değeri geçerse render etmiyor)
camera.position.z = 20; // kamera uzaklığı
scene.add(camera);

// html içindeki canvasa bas
const canvas = document.querySelector(".webgl");
const renderer = new THREE.WebGL1Renderer({ canvas });

renderer.setSize(sizes.width, sizes.heigth); // ekran boyutu
renderer.setPixelRatio(2);
renderer.render(scene, camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.enablePan = false;
controls.enableZoom = false;
controls.autoRotate = true;
controls.autoRotateSpeed = 5;

// Resize
window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // update camera
  camera.aspect = sizes.width / sizes.heigth;
  // objenin bozulmasını engellemek için
  camera.updateProjectionMatrix();
  renderer.setSize(sizes.width, sizes.heigth);
});

// animasyon için ekranı sürekli güncelle
const loop = () => {
  controls.update();
  renderer.render(scene, camera);
  window.requestAnimationFrame(loop);
};

loop();

// Animation sync
const tl = gsap.timeline({ defaults: { duration: 1 } }); // animasyon süresi
tl.fromTo(mesh.scale, { z: 0, x: 0, y: 0 }, { z: 1, x: 1, y: 1 }); // neyi, nerden, nereye götüreceğin
tl.fromTo("nav", { y: "-100%" }, { y: "0%" });
tl.fromTo(".title", { opacity: 0 }, { opacity: 1 });

// Mouse Animation Color
let mouseDown = false;
let rgb = [12, 23, 55]; // kırmızı, yeşil, mavi
window.addEventListener("mousedown", () => {
  mouseDown = true;
});
window.addEventListener("mouseup", () => {
  mouseDown = false;
});

window.addEventListener("mousemove", (e) => {
  if (mouseDown) {
    rgb = [
      Math.round((e.pageX / sizes.width) * 255),
      Math.round((e.pageX / sizes.heigth) * 255),
      150,
    ];
  }
  // animate
  let newColor = new THREE.Color(`rgb(${rgb.join(",")})`); // new THREE.Color(`rgb(0,100,150)`)

  gsap.to(mesh.material.color, newColor);
});
