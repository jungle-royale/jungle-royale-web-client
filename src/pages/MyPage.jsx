import { useEffect, useRef } from "react";
import * as THREE from "three";
import Input from "../components/Input"; // Adjust import path if necessary
import "./MyPage.css";

const MyPage = () => {
  const mountRef = useRef(null); // 캔버스를 렌더링할 DOM 요소 참조

  useEffect(() => {
    // Three.js 기본 설정
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
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

    const getRelativeMousePosition = (event) => {
      const rect = mountRef.current.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      return { x, y };
    };

    const handleMouseMove = (event) => {
      const { x, y } = getRelativeMousePosition(event);
      mouseX = x;
      mouseY = y;
    };

    const handleMouseDown = (event) => {
      if (mountRef.current.contains(event.target)) {
        isMouseDown = true;
      }
    };

    const handleMouseUp = () => {
      isMouseDown = false;
    };

    const handleDoubleClick = (event) => {
      if (mountRef.current.contains(event.target)) {
        if (isCameraClose) {
          camera.position.z = 5;
        } else {
          camera.position.z = 2;
        }
        isCameraClose = !isCameraClose;
      }
    };

    const handleWheel = (event) => {
      if (mountRef.current.contains(event.target)) {
        camera.position.z += event.deltaY * 0.01; // 휠 값을 사용해 delta 계산
        camera.position.z = Math.max(2, Math.min(10, camera.position.z)); // 카메라 z축 위치 제한 (2 ~ 10)
        event.preventDefault();
        event.stopPropagation();
      }
    };

    const handleResize = () => {
      camera.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    };

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
    mountRef.current.addEventListener("mousemove", handleMouseMove);
    mountRef.current.addEventListener("mousedown", handleMouseDown);
    mountRef.current.addEventListener("mouseup", handleMouseUp);
    mountRef.current.addEventListener("dblclick", handleDoubleClick);
    mountRef.current.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("resize", handleResize);

    animate();

    // 클린업 함수
    return () => {
      mountRef.current.removeEventListener("mousemove", handleMouseMove);
      mountRef.current.removeEventListener("mousedown", handleMouseDown);
      mountRef.current.removeEventListener("mouseup", handleMouseUp);
      mountRef.current.removeEventListener("dblclick", handleDoubleClick);
      mountRef.current.removeEventListener("wheel", handleWheel);
      window.removeEventListener("resize", handleResize);
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement); 
      }
    };
  }, []);

  return (
    <div className="mypage-container">
      <div
        ref={mountRef}
        className="mypage-canvas"
      />
      <div className="mypage-form">
        <h2>닉네임 정보</h2>
        <Input label="닉네임" type="text" value="" onChange={() => {}} placeholder="닉네임 입력" />
        <Input label="전적" type="text" value="" onChange={() => {}} placeholder="전적 정보 입력" />
        <Input label="선물함" type="text" value="" onChange={() => {}} placeholder="선물함 입력" />
      </div>
    </div>
  );
};

export default MyPage;
