import { useEffect, useState } from "react";
import { fetchPosts } from "../api.js";
import useSafeNavigation from "../hooks/useSafeNavigation.jsx"; // useSafeNavigation 훅 가져오기

const Post = () => {
  const [posts, setPosts] = useState([]);
  const { navigateSafely } = useSafeNavigation(); // 안전한 네비게이션 훅 사용

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const response = await fetchPosts(); // API 호출
        const data = response.data;
        setPosts(Array.isArray(data) ? data : []); // 상태에 저장
      } catch (error) {
        console.error("게시물을 불러오는 중 오류 발생:", error);
        setPosts([]);
      }
    };

    loadPosts();
  }, []);

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
      <h1>게시물 목록</h1>
      <button
        onClick={(e) => navigateSafely(e, "/post-creator")} // navigateSafely 사용
        style={{
          marginBottom: "20px",
          padding: "10px 20px",
          backgroundColor: "#007BFF",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        글쓰기
      </button>
      {posts.length > 0 ? (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {posts.map((post) => (
            <li
              key={post.id}
              style={{
                borderBottom: "1px solid #ccc",
                padding: "10px 0",
                fontSize: "18px",
              }}
            >
              <h3>{post.title}</h3>
              <p>{post.content}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>게시물이 없습니다.</p>
      )}
    </div>
  );
};

export default Post;