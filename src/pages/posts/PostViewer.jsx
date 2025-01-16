import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import useSafeNavigation from "../../hooks/useSafeNavigation.jsx";
import { deletePost, getPost } from "../../api.js";
import "./PostViewer.css";
import useJwtField from "../../hooks/useJwtField.jsx";
import log from "loglevel";

const PostViewer = () => {
  const { id } = useParams();
  const { navigateSafely } = useSafeNavigation();
  const [post, setPost] = useState(null);
  const [isOwner, setIsOwner] = useState(false);

  const jwtToken = localStorage.getItem("jwt_token");
  const sub = useJwtField(jwtToken, "sub");

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await getPost(id);
        log.info("Fetched Post Data:", response.data);

        setPost(response.data);

        // JWT가 없거나, JWT의 sub와 writerId가 다르면 isOwner를 false로 설정
        if (sub && response.data.writerId === parseInt(sub, 10)) {
          setIsOwner(true);
        } else {
          setIsOwner(false);
        }
      } catch (error) {
        log.error("게시물을 불러오는 중 오류 발생:", error.message);
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
        navigateSafely(e, "/posts");
      } catch (error) {
        log.error("게시물 삭제 중 오류 발생:", error.message);
        alert("게시물 삭제에 실패했습니다. 다시 시도해주세요.");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white bg-opacity-80 min-h-[500px] shadow-lg rounded-lg p-8 w-full max-w-2xl">
      {post ? (
          <>
            <h1 className="text-2xl font-bold text-gray-800 mb-4">{post.title}</h1>
            <p className="text-gray-700 mb-6">{post.content}</p>
            {isOwner && (
              <div className="flex justify-end space-x-4">
                <button
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                  onClick={handleEdit}
                >
                  수정
                </button>
                <button
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                  onClick={handleDelete}
                >
                  삭제
                </button>
              </div>
            )}
          </>
        ) : (
          <p className="text-gray-800 text-lg font-semibold">게시물을 불러오는 중입니다...</p>
        )}
        <button className="text-blue-500" onClick={(e) => navigateSafely(e, "/posts")}>뒤로가기</button>
      </div>
    </div>
  );
};

export default PostViewer;
