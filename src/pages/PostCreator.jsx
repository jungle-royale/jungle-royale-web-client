import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../components/Input";
import { createPost } from "../api";
import { useClickLock } from '../contexts/ClickLockContext';
import './PostCreator.css';

const PostCreator = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null); // 미리보기 상태 추가
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { isLocked, lock, unlock } = useClickLock();
  const navigate = useNavigate();

  const handleImageChange = (event) => {
    if (isLocked) return; // 잠금 상태에서는 파일 업로드 방지
    const file = event.target.files[0];
    setImage(file);

    // 파일이 존재하면 미리보기 URL 생성
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl); // 미리보기 상태 업데이트
    } else {
      setImagePreview(null); // 파일이 없을 경우 미리보기 초기화
    }
  };

  const handleSubmit = async () => {
    if (isLocked) return; // 중복 클릭 방지
    if (!title || !content) {
      alert("제목과 본문을 입력해주세요.");
      return;
    }

    lock(); // 클릭 잠금 활성화
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    if (image) {
      formData.append("image", image);
    }

    try {
      const data = await createPost(formData); // API 호출
      console.log("게시 성공:", data);
      alert("게시물이 성공적으로 등록되었습니다.");
      navigate("/post");
    } catch (error) {
      console.error("게시 실패:", error.response?.data || error.message);
      alert("게시 중 오류가 발생했습니다.");
    } finally {
      setIsSubmitting(false);
      unlock(); // 잠금 해제
    }
  };

  return (
    <div>
      <h1>게시판 글쓰기</h1>
      <Input
        label="제목"
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="제목을 입력하세요"
      />
      <Input
        label="본문"
        type="textarea"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="본문 내용을 입력하세요"
      />
      <div>
        <label>사진</label>
        <input type="file" onChange={handleImageChange} />
        {imagePreview && ( // 이미지 미리보기 표시
          <div style={{ marginTop: "10px" }}>
            <p>미리보기:</p>
            <img
              src={imagePreview}
              alt="이미지 미리보기"
              style={{ maxWidth: "100%", maxHeight: "300px", objectFit: "contain" }}
            />
          </div>
        )}
      </div>
      <button onClick={handleSubmit} disabled={isSubmitting}>
        {isSubmitting ? "게시 중..." : "게시"}
      </button>
    </div>
  );
};

export default PostCreator;
