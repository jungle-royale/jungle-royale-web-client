// const MyPage = () => {
//   return (
//     <div>
//       <h1>마이페이지</h1>
//       <p>회원 전용 페이지입니다.</p>
//     </div>
//   );

// }

// export default MyPage;

import { useEffect, useRef } from "react";
import * as THREE from "three";

const MyPage = () => {
  const mountRef = useRef(null); // 캔버스를 렌더링할 DOM 요소 참조

  useEffect(() => {
    // Three.js 기본 설정
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    mountRef.current.appendChild(renderer.domElement); // DOM에 렌더러 추가

    // 축 헬퍼 추가
    const axesHelper = new THREE.AxesHelper(5);
    scene.add(axesHelper);

    // 큐브 생성
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    camera.position.z = 5;

    // 마우스 이벤트 처리
    let mouseX = 0;
    let mouseY = 0;
    let isMouseDown = false;
    let isCameraClose = false;

    const handleMouseMove = (event) => {
      mouseX = (event.clientX / window.innerWidth) - 0.5;
      mouseY = (event.clientY / window.innerHeight) - 0.5;
    };

    const handleMouseDown = () => {
      isMouseDown = true;
    };

    const handleMouseUp = () => {
      isMouseDown = false;
    };

    const handleDoubleClick = () => {
      if (isCameraClose) {
        camera.position.z = 5;
      } else {
        camera.position.z = 2;
      }
      isCameraClose = !isCameraClose;
    };

    // 휠 이벤트 리스너 추가
    const handleWheel = () => {
      camera.position.z += event.deltaY * 0.01; // 휠 값을 사용해 delta 계산
      camera.position.z = Math.max(2, Math.min(10, camera.position.z)); // 카메라 z축 위치 제한 (2 ~ 10)
    }

    // 애니메이션 루프
    const animate = () => {
      requestAnimationFrame(animate);
      if (isMouseDown) {
        cube.rotation.x = mouseY * Math.PI * 2;
        cube.rotation.y = mouseX * Math.PI * 2;
      }
      renderer.render(scene, camera);
    };

    // 이벤트 리스너 등록
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("dblclick", handleDoubleClick);
    window.addEventListener("wheel", handleWheel);



    animate();

    // 클린업 함수
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("dblclick", handleDoubleClick);
      window.removeEventListener("wheel", handleWheel);
      mountRef.current.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} style={{ width: "100%", height: "100vh" }} />;
};

export default MyPage;
