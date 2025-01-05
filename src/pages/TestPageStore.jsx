import { useEffect, useRef } from "react";
import * as THREE from "three";
// import { TextureLoader } from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { Sky } from "three/examples/jsm/objects/Sky";
import "./mypage/MyPage.css";

const loadModelWithTexture = (scene, modelRef) => {
  const loader = new GLTFLoader();
  // const textureLoader = new TextureLoader();

  // 텍스처 로드
  // const texture = textureLoader.load('/assets/RW_LP_Texture_00.jpg'); // 경로 확인 필요

  loader.load(
    '/assets/RW_LP_CP_Character_SnowMan.001.gltf', // 모델 경로
    (gltf) => {
      const model = gltf.scene;
      console.log(model);

      // 텍스처 적용
      model.traverse((child) => {
        if (child.isMesh) {
          // child.material.map = texture;
          child.material.needsUpdate = true; // 변경 사항 반영
        }
      });

      model.scale.set(2, 2, 2); // 크기 조정
      model.position.set(0, 0, 0);
      scene.add(model); // 씬에 추가

      modelRef.current = model; // modelRef에 저장
    },
    undefined,
    (error) => {
      console.error("Error loading GLTF:", error);
    }
  );
};

const TestPageStore = () => {  
  const mountRef = useRef(null); // 캔버스를 렌더링할 DOM 요소 참조
  const modelRef = useRef(null); // 로드된 모델 참조

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
    // renderer.shadowMap.enabled = true; // 그림자 활성화
    // renderer.shadowMap.type = THREE.PCFSoftShadowMap; // 부드러운 그림자

    // 축 헬퍼 추가
    const axesHelper = new THREE.AxesHelper(5);
    scene.add(axesHelper);

    camera.position.set(5, 5, 5); // 초기 카메라 위치
    camera.lookAt(0, 0, 0);

    // 조명 추가
    const ambientLight = new THREE.AmbientLight(0xffffff, 1); //부드러운 환경 조명
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1); // 강한 방향 조명
    directionalLight.position.set(-5, 5, -5);
    directionalLight.target.position.set(0, 1, 0);
    scene.add(directionalLight);
    scene.add(directionalLight.target);
    const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight, 1);
    scene.add(directionalLightHelper);

    loadModelWithTexture(scene, modelRef);

    ///////////////////////////////////////////////////////////////////
    // 빙하 느낌의 하늘 설정
    const sky = new Sky();
    sky.scale.setScalar(1000);
    scene.add(sky);

    const sun = new THREE.Vector3();
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const sunPhi = THREE.MathUtils.degToRad(90-20); // 태양 고도
    const sunTheta = THREE.MathUtils.degToRad(45); // 태양 방위각

    sun.setFromSphericalCoords(1, sunPhi, sunTheta);
    sky.material.uniforms["sunPosition"].value.copy(sun);

    const environmentMap = pmremGenerator.fromScene(sky).texture;
    scene.environment = environmentMap;
    ///////////////////////////////////////////////////////////////////

    // 이동 관련 변수
    const moveSpeed = 0.1;
    const moveDirection = { forward: false, backward: false, left: false, right: false };

    // 마우스 이벤트 처리
    let radius = Math.sqrt(
      camera.position.x ** 2 +
      camera.position.y ** 2 +
      camera.position.z ** 2
    ); // 초기 반경
    let isMouseDown = false;
    let startMouseX = 0;
    let startMouseY = 0;
    let rotationTheta = Math.atan2(camera.position.z, camera.position.x); // 초기 수평 각도

    let rotationPhi = Math.acos(camera.position.y / radius); // 초기 수직 각도
    const handleMouseMove = (event) => {
      if (!isMouseDown) return;
      const deltaX = event.clientX - startMouseX;
      const deltaY = event.clientY - startMouseY;
      startMouseX = event.clientX;
      startMouseY = event.clientY;

      // 마우스 움직임에 따라 각도 조정
      rotationTheta += deltaX * 0.01; // 수평 회전
      rotationPhi -= deltaY * 0.01; // 수직 회전

      // 수직 회전 각도 제한 (상하로 완전히 뒤집히지 않도록)
      rotationPhi = Math.max(0.1, Math.min(Math.PI - 0.1, rotationPhi));

      // 새로운 카메라 위치 계산
      const x = radius * Math.sin(rotationPhi) * Math.cos(rotationTheta);
      const y = radius * Math.cos(rotationPhi);
      const z = radius * Math.sin(rotationPhi) * Math.sin(rotationTheta);

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
      const delta = event.deltaY * 0.005; // 델타 값 감소-더 부드러운 줌 효과
      radius += delta;
      radius = Math.max(3, Math.min(10, radius)); // 거리 제한

      camera.position.set(
        radius * Math.sin(rotationPhi) * Math.cos(rotationTheta),
        radius * Math.cos(rotationPhi),
        radius * Math.sin(rotationPhi) * Math.sin(rotationTheta)
      );
      camera.lookAt(0, 0, 0);
    };

    // 키보드 이벤트 핸들러
    const handleKeyDown = (event) => {
      switch (event.key) {
        case "w":
          moveDirection.forward = true;
          break;
        case "s":
          moveDirection.backward = true;
          break;
        case "a":
          moveDirection.left = true;
          break;
        case "d":
          moveDirection.right = true;
          break;
        default:
          break;
      }
    };

    const handleKeyUp = (event) => {
      switch (event.key) {
        case "w":
          moveDirection.forward = false;
          break;
        case "s":
          moveDirection.backward = false;
          break;
        case "a":
          moveDirection.left = false;
          break;
        case "d":
          moveDirection.right = false;
          break;
        default:
          break;
      }
    };

    const handleResize = () => {
      camera.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    };

    // 객체 이동 업데이트 함수
    const updateObjectPosition = () => {
      const model = modelRef.current;
      if (!model) return;
      console.log("객체 이동 확인");
      if (moveDirection.forward) model.position.z -= moveSpeed;
      if (moveDirection.backward) model.position.z += moveSpeed;
      if (moveDirection.left) model.position.x -= moveSpeed;
      if (moveDirection.right) model.position.x += moveSpeed;
    };

    // 애니메이션 루프
    const animate = () => {
      requestAnimationFrame(animate);
      if (moveDirection.forward || moveDirection.backward || moveDirection.left || moveDirection.right) {
        updateObjectPosition();
    }
      renderer.render(scene, camera);
    };

    // 이벤트 리스너 등록
    mountRef.current.addEventListener("mousemove", handleMouseMove);
    mountRef.current.addEventListener("mousedown", handleMouseDown);
    mountRef.current.addEventListener("mouseup", handleMouseUp);
    mountRef.current.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    window.addEventListener("resize", handleResize);

    animate();

    // 클린업 함수
    return () => {
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
        mountRef.current.removeEventListener("mousemove", handleMouseMove);
        mountRef.current.removeEventListener("mousedown", handleMouseDown);
        mountRef.current.removeEventListener("mouseup", handleMouseUp);
        mountRef.current.removeEventListener("wheel", handleWheel);
      }
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  if (  import.meta.env.VITE_API_BASE_URL !== 'true') {
    return null; // 개발 환경이 아니면 아무것도 렌더링하지 않음
  }
  
  return <div ref={mountRef} className="mypage-canvas" />;
};

export default TestPageStore;
