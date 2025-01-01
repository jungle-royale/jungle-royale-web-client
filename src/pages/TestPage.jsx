import { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";
import "./MyPage.css";

const TestPage = () => {
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
    renderer.shadowMap.enabled = true; // 그림자 활성화
    renderer.shadowMap.type = THREE.PCFSoftShadowMap; // 부드러운 그림자

    // 축 헬퍼 추가
    const axesHelper = new THREE.AxesHelper(5);
    scene.add(axesHelper);

    camera.position.set(5, 5, 5); // 초기 카메라 위치
    camera.lookAt(0, 0, 0);

    // 조명 추가
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); // 부드러운 환경 조명
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5); // 강한 방향 조명
    directionalLight.position.set(5, 5, 5);
    directionalLight.target.position.set(0, 1, 0);
    scene.add(directionalLight);
    scene.add(directionalLight.target);
    const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight, 1);
    scene.add(directionalLightHelper);

    // HDR 환경맵 로드
    const rgbeLoader = new RGBELoader();
    rgbeLoader.load("/path_to_hdr.hdr", (texture) => {
      texture.mapping = THREE.EquirectangularReflectionMapping; // 구형 맵핑 방식
      scene.environment = texture; // 환경맵 설정
      scene.background = texture; // 배경으로 설정 (선택 사항)

      // GLTFLoader로 모델 로드
      const loader = new GLTFLoader();
      loader.load(
        "/assets/RW_Snowman01.glb",
        (gltf) => {
          const model = gltf.scene;
          model.traverse((child) => {
            if (child.isMesh) {
              // 환경맵을 반사로 적용
              child.material.envMap = texture;
              child.material.needsUpdate = true;
            }
          });
          model.scale.set(2, 2, 2);
          scene.add(model);
        },
        undefined,
        (error) => {
          console.error("An error occurred while loading the GLB model:", error);
        }
      );
    });

    // 마우스 이벤트 처리
    let isMouseDown = false;
    let startMouseX = 0;
    let startMouseY = 0;
    let theta = 0; // 수평 회전 각도
    let phi = Math.PI / 4; // 수직 회전 각도
    const radius = 5; // 카메라의 거리

    const handleMouseMove = (event) => {
      if (!isMouseDown) return;
      const deltaX = event.clientX - startMouseX;
      const deltaY = event.clientY - startMouseY;
      startMouseX = event.clientX;
      startMouseY = event.clientY;

      // 마우스 움직임에 따라 각도 조정
      theta += deltaX * 0.01; // 수평 회전
      phi -= deltaY * 0.01; // 수직 회전

      // 수직 회전 각도 제한 (상하로 완전히 뒤집히지 않도록)
      phi = Math.max(0.1, Math.min(Math.PI - 0.1, phi));

      // 새로운 카메라 위치 계산
      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.cos(phi);
      const z = radius * Math.sin(phi) * Math.sin(theta);

      camera.position.set(x, y, z);
      camera.lookAt(0, 0, 0);
    };

    const handleMouseDown = (event) => {
      isMouseDown = true;
      startMouseX = event.clientX;
      startMouseY = event.clientY;
    };

    const handleMouseUp = () => {
      isMouseDown = false;
    };

    const handleWheel = (event) => {
      const delta = event.deltaY * 0.01;
      const newRadius = radius + delta;
      const clampedRadius = Math.max(1, Math.min(10, newRadius)); // 거리 제한
      camera.position.set(
        clampedRadius * Math.sin(phi) * Math.cos(theta),
        clampedRadius * Math.cos(phi),
        clampedRadius * Math.sin(phi) * Math.sin(theta)
      );
      camera.lookAt(0, 0, 0);
    };

    const handleResize = () => {
      camera.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    };

    // 애니메이션 루프
    const animate = () => {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };

    // 이벤트 리스너 등록
    mountRef.current.addEventListener("mousemove", handleMouseMove);
    mountRef.current.addEventListener("mousedown", handleMouseDown);
    mountRef.current.addEventListener("mouseup", handleMouseUp);
    mountRef.current.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("resize", handleResize);

    animate();

    // 클린업 함수
    return () => {
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
      mountRef.current.removeEventListener("mousemove", handleMouseMove);
      mountRef.current.removeEventListener("mousedown", handleMouseDown);
      mountRef.current.removeEventListener("mouseup", handleMouseUp);
      mountRef.current.removeEventListener("wheel", handleWheel);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return <div ref={mountRef} className="mypage-canvas" />;
};

export default TestPage;
