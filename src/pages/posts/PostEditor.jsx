import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPost, updatePost } from "../../api";
import { useClickLock } from "../../contexts/ClickLockContext";
import "./PostEditor.css";
import log from "loglevel";

const PostEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  // const [post, setPost] = useState({ title: "", content: "", image: null });
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
          image: null,
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

  // const handleImageChange = (event) => {
  //   if (isLocked) return;
  //   setPost((prev) => ({ ...prev, image: event.target.files[0] }));
  // };

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
    if (post.image) {
      formData.append("image", post.image);
    }

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
    <div className="postedit-container">
      <h1 className="postedit-header">게시물 수정</h1>
      <label className="postedit-input-label" htmlFor="title">제목</label>
      <input
        id="title"
        type="text"
        name="title"
        value={post.title}
        onChange={handleChange}
        className="postedit-input"
        placeholder="제목을 입력하세요"
      />
      <label className="postedit-input-label" htmlFor="content">본문</label>
      <textarea
        id="content"
        name="content"
        value={post.content}
        onChange={handleChange}
        className="postedit-input"
        placeholder="본문 내용을 입력하세요"
      />
      {/* <div>
        <label className="postedit-input-label">사진</label>
        <input
          type="file"
          onChange={handleImageChange}
          className="postedit-input-file"
        />
      </div> */}
      <button
        onClick={handleSubmit}
        disabled={isSubmitting}
        className="postedit-button"
      >
        {isSubmitting ? "수정 중..." : "저장"}
      </button>
    </div>
  );
};

export default PostEditor;
