import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import useSafeNavigation from "../../hooks/useSafeNavigation.jsx";
import { deletePost, getPost } from "../../api.js";
import "./PostViewer.css";
import useJwtField from "../../hooks/useJwtField.jsx";
import log from 'loglevel';

// import { useLoginContext } from "../contexts/LoginContext";

const PostViewer = () => {
  const { id } = useParams();
  const { navigateSafely } = useSafeNavigation();
  const [post, setPost] = useState(null);
  const [isOwner, setIsOwner] = useState(false);

  // const { jwtToken } = useLoginContext();
  const jwtToken = localStorage.getItem("jwt_token");
  const sub = useJwtField(jwtToken, "sub");

  useEffect(() => {
    if (sub === null) {
      log.info("sub 값이 null이므로 fetchPost를 호출하지 않음");
      return;
    }

    const fetchPost = async () => {
      try {
        const response = await getPost(id);
        log.info("Fetched Post Data:", response.data);
        log.info("Decoded sub from JWT:", sub);

        setPost(response.data);
        setIsOwner(response.data.writerId === parseInt(sub, 10));
      } catch (error) {
        console.error("게시물을 불러오는 중 오류 발생:", error.message);
      }
    };

    fetchPost();
  }, [id, sub]);

  const handleEdit = (e) => {
    e.preventDefault();
    navigateSafely(e, `/posts/${id}/update`);
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    if (window.confirm("정말로 삭제하시겠습니까?")) {
      try {
        await deletePost(id);
        navigateSafely(e, "/");
      } catch (error) {
        console.error("게시물 삭제 중 오류 발생:", error.message);
        alert("게시물 삭제에 실패했습니다. 다시 시도해주세요.");
      }
    }
  };

  return (
    <div className="post-viewer">
      {post ? (
        <>
          <h1>{post.title}</h1>
          <p>{post.content}</p>
          {/* {post.imageUrl && (
            <div className="post-image-container">
              <img
                src={post.imageUrl}
                alt="게시물 이미지"
                className="post-image"
              />
            </div>
          )} */}
          {isOwner && (
            <div className="button-group">
              <button className="edit-button" onClick={handleEdit}>
                수정
              </button>
              <button className="delete-button" onClick={handleDelete}>
                삭제
              </button>
            </div>
          )}
        </>
      ) : (
        <p className="loading-message">게시물을 불러오는 중입니다...</p>
      )}
    </div>
  );
};

export default PostViewer;
