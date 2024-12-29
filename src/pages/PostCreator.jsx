import { useState } from "react";
import Input from "../components/Input";
import { createPost } from "../api";
//import { useClickLock } from '../contexts/ClickLockContext';

const PostCreator = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  //const { isLocked, lock, unlock } = useClickLock();


  const handleImageChange = (event) => {
    setImage(event.target.files[0]);
  };

  const handleSubmit = async () => {
    if (!title || !content) {
      alert("제목과 본문을 입력해주세요.");
      return;
    }

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
    } catch (error) {
      console.error("게시 실패:", error.response?.data || error.message);
      alert("게시 중 오류가 발생했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
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
      </div>
      <button onClick={handleSubmit} disabled={isSubmitting}>
        {isSubmitting ? "게시 중..." : "게시"}
      </button>
    </div>
  );
};

export default PostCreator;
