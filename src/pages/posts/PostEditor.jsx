import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPost, updatePost } from "../../api";
import { useClickLock } from "../../contexts/ClickLockContext";
import log from "loglevel";

const PostEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState({ title: "", content: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { isLocked, lock, unlock } = useClickLock();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await getPost(id);
        setPost({
          title: response.data.title,
          content: response.data.content,
        });
      } catch (error) {
        log.error("게시물 로드 오류:", error.message);
        alert("게시물을 불러오는 데 실패했습니다.");
      }
    };
    fetchPost();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPost((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (isLocked) return;
    if (!post.title || !post.content) {
      alert("제목과 본문을 입력해주세요.");
      return;
    }

    lock();
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("title", post.title);
    formData.append("content", post.content);

    try {
      await updatePost(id, formData);
      navigate(`/posts/${id}`);
    } catch (error) {
      log.error("수정 실패:", error.message);
      alert("수정 중 오류가 발생했습니다.");
    } finally {
      setIsSubmitting(false);
      unlock();
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen pt-16">
      <div className="w-11/12 max-w-3xl p-8 rounded-lg shadow-lg bg-white bg-opacity-80 backdrop-blur-md backdrop-brightness-125 mt-6">
        <h1 className="text-2xl font-bold text-blue-700 mb-6 text-center">
          게시물 수정
        </h1>

        <label htmlFor="title" className="block text-lg font-medium text-gray-800 mb-2">
          제목
        </label>
        <input
          id="title"
          type="text"
          name="title"
          value={post.title}
          onChange={handleChange}
          className="w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none mb-6"
          placeholder="제목을 입력하세요"
        />

        <label htmlFor="content" className="block text-lg font-medium text-gray-800 mb-2">
          본문
        </label>
        <textarea
          id="content"
          name="content"
          value={post.content}
          onChange={handleChange}
          className="w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none mb-6 h-60"
          placeholder="본문 내용을 입력하세요"
        />

        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className={`w-full py-3 text-lg font-bold text-white rounded-lg shadow-md ${
            isSubmitting ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {isSubmitting ? "수정 중..." : "저장"}
        </button>
      </div>
    </div>
  );
};

export default PostEditor;
