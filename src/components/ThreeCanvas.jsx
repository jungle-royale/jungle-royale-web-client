import { useEffect, useRef } from "react";
import * as THREE from "three";

const ThreeCanvas = () => {
  const mountRef = useRef(null); // 캔버스를 렌더링할 DOM 요소 참조

  useEffect(() => {
    if (!mountRef.current) return;

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
    mountRef.current.appendChild(renderer.domElement);

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
      const rect = mountRef.current?.getBoundingClientRect();
      if (!rect) return { x: 0, y: 0 };
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
      if (mountRef.current?.contains(event.target)) {
        isMouseDown = true;
      }
    };

    const handleMouseUp = () => {
      isMouseDown = false;
    };

    const handleDoubleClick = (event) => {
      if (mountRef.current?.contains(event.target)) {
        camera.position.z = isCameraClose ? 5 : 2;
        isCameraClose = !isCameraClose;
      }
    };

    const handleWheel = (event) => {
      if (mountRef.current?.contains(event.target)) {
        camera.position.z += event.deltaY * 0.01;
        camera.position.z = Math.max(2, Math.min(10, camera.position.z));
        event.preventDefault();
        event.stopPropagation();
      }
    };

    const handleResize = () => {
      if (!mountRef.current) return;
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
      if (mountRef.current) {
        mountRef.current.removeEventListener("mousemove", handleMouseMove);
        mountRef.current.removeEventListener("mousedown", handleMouseDown);
        mountRef.current.removeEventListener("mouseup", handleMouseUp);
        mountRef.current.removeEventListener("dblclick", handleDoubleClick);
        mountRef.current.removeEventListener("wheel", handleWheel);
        mountRef.current.removeChild(renderer.domElement);
      }
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return <div ref={mountRef} className="three-canvas" />;
};

export default ThreeCanvas;
