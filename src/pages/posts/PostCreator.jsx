import { useState } from "react";
import { useNavigate } from "react-router-dom";
// import Input from "../components/Input";
import { createPost } from "../../api";
import { useClickLock } from "../../contexts/ClickLockContext";
import log from "loglevel";

const PostCreator = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [errors, setErrors] = useState({});
  // const [image, setImage] = useState(null);
  // const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { isLocked, lock, unlock } = useClickLock();
  const navigate = useNavigate();

  const validateFields = (fieldName, value) => {
    const newErrors = { ...errors };
    if (fieldName === "title" && value.trim() === "") {
      newErrors.title = "제목을 입력해주세요.";
    } else {
      delete newErrors.title;
    }

    if (fieldName === "content" && value.trim() === "") {
      newErrors.content = "본문 내용을 입력해주세요.";
    } else {
      delete newErrors.content;
    }

    setErrors(newErrors);
  };

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

  const handleTitleChange = (e) => {
    const value = e.target.value;
    setTitle(value);
    validateFields("title", value);
  };

  const handleContentChange = (e) => {
    const value = e.target.value;
    setContent(value);
    validateFields("content", value);
  };

  const handleSubmit = async () => {
    if (isLocked) return;
    if (!title.trim() || !content.trim()) {
      validateFields("title", title);
      validateFields("content", content);
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
      navigate("/posts");
    } catch (error) {
      log.error("게시 실패:", error.response?.data || error.message);
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
          onChange={handleTitleChange}
          placeholder="제목을 입력하세요"
          className={`w-full p-4 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none mb-2 ${
            errors.title ? "border-red-500 focus:ring-red-500" : "border-gray-300"
          }`}
        />
        {errors.title && <p className="text-red-500 text-sm mb-4">{errors.title}</p>}


        <label htmlFor="content" className="block text-lg font-medium text-gray-800 mb-2">
          본문
        </label>
        <textarea
          id="content"
          value={content}
          onChange={handleContentChange}
          placeholder="본문 내용을 입력하세요"
          className={`w-full p-4 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none mb-2 h-60 ${
            errors.content ? "border-red-500 focus:ring-red-500" : "border-gray-300"
          }`}
        />
        {errors.content && <p className="text-red-500 text-sm mb-4">{errors.content}</p>}


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
