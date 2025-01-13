import { useState } from "react";
import { useNavigate } from "react-router-dom";
// import Input from "../components/Input";
import { createPost } from "../../api";
import { useClickLock } from "../../contexts/ClickLockContext";
import log from "loglevel";

const PostCreator = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  // const [image, setImage] = useState(null);
  // const [imagePreview, setImagePreview] = useState(null);
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
      log.info("게시 성공:", data);
      alert("게시물이 성공적으로 등록되었습니다.");
      navigate("/posts");
    } catch (error) {
      log.error("게시 실패:", error.response?.data || error.message);
      alert("게시 중 오류가 발생했습니다.");
    } finally {
      setIsSubmitting(false);
      unlock();
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen pt-16">
      {/* 여백 추가 */}
      <div className="w-11/12 max-w-3xl p-8 rounded-lg shadow-lg bg-white bg-opacity-80 backdrop-brightness-125 mt-6">
        <h1 className="text-2xl font-bold text-blue-700 mb-6 text-center">
          게시판 글쓰기
        </h1>

        <label htmlFor="title" className="block text-lg font-medium text-gray-800 mb-2">
          제목
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="제목을 입력하세요"
          className="w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none mb-6"
        />

        <label htmlFor="content" className="block text-lg font-medium text-gray-800 mb-2">
          본문
        </label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="본문 내용을 입력하세요"
          className="w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none mb-6 h-60"
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
          onClick={handleSubmit}
          disabled={isSubmitting}
          className={`w-full py-3 text-lg font-bold text-white rounded-lg shadow-md ${
            isSubmitting ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {isSubmitting ? "게시 중..." : "게시"}
        </button>
      </div>
    </div>
  );
};

export default PostCreator;
