import { useEffect, useState } from "react";
import { fetchPosts } from "../api.js";
import useSafeNavigation from "../hooks/useSafeNavigation"; // useSafeNavigation 훅 가져오기


const Board = () => {
  const [posts, setPosts] = useState([]);
  const { navigateSafely } = useSafeNavigation(); // 안전한 네비게이션 훅 사용


  useEffect(() => {
    const loadPosts = async () => {
      try {
        const data = await fetchPosts(); // API 호출
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
        onClick={(e) => navigateSafely(e, "/board-creator")} // navigateSafely 사용
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
            {post.title}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Board;