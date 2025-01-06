import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import Input from "../../components/Input.jsx"; 
import { fetchMyPage, myPageEdit } from '../../api.js';
import "./MyPage.css";
import log from 'loglevel';


const MyPage = () => {
  const [nickname, setNickname] = useState('');
  const mountRef = useRef(null); // 캔버스를 렌더링할 DOM 요소 참조
  
  const handleNicknameChange = (e) => {
    setNickname(e.target.value);
  };
  
  const handleSaveNickname = async () => {
    try {
      await myPageEdit(nickname); // 닉네임 업데이트
      alert('닉네임이 성공적으로 변경되었습니다.'); // 성공 메시지 경고창으로 표시
      const response = await fetchMyPage();
      setNickname(response.data.username || ''); // 닉네임 업데이트
      window.location.reload();
    } catch (error) {
      alert('닉네임 변경 중 오류가 발생했습니다.');
      console.error(error);
    }
  };
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchMyPage();
        setNickname(response.data.username || '');
      } catch (error) {
        console.error('마이페이지 데이터를 불러오는 중 오류 발생:', error);
      }
    };

    fetchData(); // 초기 데이터를 가져옴

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

    camera.position.z = 5;

    // GLTFLoader로 모델 로드
    const loader = new GLTFLoader();
    loader.load(
      "/assets/RW_Snowman01.glb", // glTF 파일 경로
      (gltf) => {
        const model = gltf.scene;
        model.scale.set(1, 1, 1); // 스케일 조정
        model.position.y = -1; // 바닥 위치 조정
        scene.add(model);
      },
      (xhr) => {
        log.info((xhr.loaded / xhr.total) * 100 + "% loaded");
      },
      (error) => {
        console.error("An error occurred while loading the GLB model:", error);
      }
    );

    const handleResize = () => {
      if (!mountRef.current) return;
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
    window.addEventListener("resize", handleResize);

    animate();

    // 클린업 함수
    return () => {
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="mypage-container">
      <div ref={mountRef} className="mypage-canvas" />
      <div className="mypage-form">
        <h2>닉네임 정보</h2>
        <Input label="닉네임" type="text" value={nickname} onChange={handleNicknameChange} placeholder="닉네임 입력" />
        <button onClick={handleSaveNickname}>닉네임 저장</button>
      </div>
    </div>
  );
};

export default MyPage;
