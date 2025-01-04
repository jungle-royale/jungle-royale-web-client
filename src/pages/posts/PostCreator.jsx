import { useState } from "react";
import { useNavigate } from "react-router-dom";
// import Input from "../components/Input";
import { createPost } from "../../api";
import { useClickLock } from "../../contexts/ClickLockContext";
import "./PostCreator.css"; 

const PostCreator = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  // const [image, setImage] = useState(null);
  //const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { isLocked, lock, unlock } = useClickLock();
  const navigate = useNavigate();

  // const handleImageChange = (event) => {
  //   if (isLocked) return;
  //   const file = event.target.files[0];
  //   setImage(file);

  //   if (file) {
  //     const previewUrl = URL.createObjectURL(file);
  //     setImagePreview(previewUrl);
  //   } else {
  //     setImagePreview(null);
  //   }
  // };

  const handleSubmit = async () => {
    if (isLocked) return;
    if (!title || !content) {
      alert("제목과 본문을 입력해주세요.");
      return;
    }
    lock();
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    // if (image) {
    //   formData.append("image", image);
    // }

    try {
      const data = await createPost(formData);
      console.log("게시 성공:", data);
      alert("게시물이 성공적으로 등록되었습니다.");
      navigate("/");
    } catch (error) {
      console.error("게시 실패:", error.response?.data || error.message);
      alert("게시 중 오류가 발생했습니다.");
    } finally {
      setIsSubmitting(false);
      unlock();
    }
  };

  return (
    <div>
      <div className="postcrt-container">
        <h1 className="postcrt-header">게시판 글쓰기</h1>
        <label className="postcrt-input-label" htmlFor="title">
          제목
        </label>
        <input
          id="title"
          className="postcrt-input"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="제목을 입력하세요"
        />

        <label className="postcrt-input-label" htmlFor="content">
          본문
        </label>
        <textarea
          id="content"
          className="postcrt-input"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="본문 내용을 입력하세요"
        />

        {/* <div>
          <label className="postcrt-input-label">사진</label>
          <input
            type="file"
            className="postcrt-input-file" 
            onChange={handleImageChange}
          />
          {imagePreview && (
            <div>
              <p>미리보기:</p>
              <img
                src={imagePreview}
                alt="이미지 미리보기"
              />
            </div>
          )}
        </div> */}

        <button
          className="postcrt-button"
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? "게시 중..." : "게시"}
        </button>
      </div>
    </div>
  );
};

export default PostCreator;
