import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Input from "../components/Input";
import { getPost, updatePost } from "../api";
import { useClickLock } from "../contexts/ClickLockContext";

const PostEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState({ title: "", content: "", image: null });
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
        console.error("게시물 로드 오류:", error.message);
        alert("게시물을 불러오는 데 실패했습니다.");
      }
    };
    fetchPost();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPost((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (event) => {
    if (isLocked) return;
    setPost((prev) => ({ ...prev, image: event.target.files[0] }));
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
    if (post.image) {
      formData.append("image", post.image);
    }

    try {
      await updatePost(id, formData);
      alert("수정되었습니다.");
      navigate(`/posts/${id}`);
    } catch (error) {
      console.error("수정 실패:", error.message);
      alert("수정 중 오류가 발생했습니다.");
    } finally {
      setIsSubmitting(false);
      unlock();
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
      <h1>게시물 수정</h1>
      <Input
        label="제목"
        type="text"
        name="title"
        value={post.title}
        onChange={handleChange}
      />
      <Input
        label="본문"
        type="textarea"
        name="content"
        value={post.content}
        onChange={handleChange}
      />
      <div>
        <label>사진</label>
        <input type="file" onChange={handleImageChange} />
      </div>
      <button onClick={handleSubmit} disabled={isSubmitting}>
        {isSubmitting ? "수정 중..." : "저장"}
      </button>
    </div>
  );
};

export default PostEditor;
