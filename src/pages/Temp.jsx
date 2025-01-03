import { useEffect, useRef } from "react";
import * as THREE from "three";
import { TextureLoader } from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { Sky } from "three/examples/jsm/objects/Sky";
import "./MyPage.css";

const loadModelWithTexture = (scene, modelRef) => {
  const loader = new GLTFLoader();
  const textureLoader = new TextureLoader();

  // 텍스처 로드
  const texture = textureLoader.load('/assets/RW_LP_Texture_00.jpg');

  loader.load(
    '/assets/RW_LP_CP_Character_SnowMan.001.gltf', // 모델 경로
    (gltf) => {
      const model = gltf.scene;

      // 텍스처 적용
      model.traverse((child) => {
        if (child.isMesh) {
          child.material.map = texture;
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

const TestPage = () => {
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
    renderer.shadowMap.enabled = true; // 그림자 활성화
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // 조명 설정
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    // 하늘 환경 설정
    const sky = new Sky();
    sky.scale.setScalar(1000);
    scene.add(sky);

    const sun = new THREE.Vector3();
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const sunPhi = THREE.MathUtils.degToRad(90 - 20);
    const sunTheta = THREE.MathUtils.degToRad(45);

    sun.setFromSphericalCoords(1, sunPhi, sunTheta);
    sky.material.uniforms["sunPosition"].value.copy(sun);

    const environmentMap = pmremGenerator.fromScene(sky).texture;
    scene.environment = environmentMap;

    camera.position.set(5, 5, 5);
    camera.lookAt(0, 0, 0);

    loadModelWithTexture(scene, modelRef);

    // 이동 관련 변수
    const moveSpeed = 0.1;
    const moveDirection = { forward: false, backward: false, left: false, right: false };

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

    // 객체 이동 업데이트 함수
    const updateObjectPosition = () => {
      const model = modelRef.current;
      if (!model) return;

      if (moveDirection.forward) model.position.z -= moveSpeed;
      if (moveDirection.backward) model.position.z += moveSpeed;
      if (moveDirection.left) model.position.x -= moveSpeed;
      if (moveDirection.right) model.position.x += moveSpeed;
    };

    // 애니메이션 루프
    const animate = () => {
      requestAnimationFrame(animate);
      updateObjectPosition();
      renderer.render(scene, camera);
    };

    // 이벤트 리스너 등록
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    animate();

    // 클린업 함수
    return () => {
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  return <div ref={mountRef} className="mypage-canvas" />;
};

export default TestPage;
