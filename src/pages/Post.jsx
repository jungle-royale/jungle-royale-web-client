import { useEffect, useState } from "react";
import { fetchPosts } from "../api.js";
import useSafeNavigation from "../hooks/useSafeNavigation.jsx";
import "./Post.css"; 

const Post = () => {
  const [posts, setPosts] = useState([]);
  const { navigateSafely } = useSafeNavigation();

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const response = await fetchPosts();
        const data = response.data;
        setPosts(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("게시물을 불러오는 중 오류 발생:", error);
        setPosts([]);
      }
    };

    loadPosts();
  }, []);

  return (
    <div className="post-container">
      <h1>게시물 목록</h1>
      <button
        onClick={(e) => navigateSafely(e, "/post-creator")}
        className="write-button"
      >
        글쓰기
      </button>
      {posts.length > 0 ? (
        <ul className="post-list">
          {posts.map((post) => (
            <li
              key={post.id}
              onClick={(e) => navigateSafely(e, `/posts/${post.id}`)}
              className="post-item"
            >
              <h3>{post.title}</h3>
              <p>{post.content}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="no-posts-message">게시물이 없습니다.</p>
      )}
    </div>
  );
};

export default Post;

// import { useEffect, useState } from "react";
// import useSafeNavigation from "../hooks/useSafeNavigation.jsx";
// import "./Post.css";

// const Post = () => {
//   const [posts, setPosts] = useState([]);
//   const { navigateSafely } = useSafeNavigation();

//   useEffect(() => {
//     // 임시 게시물 데이터
//     const tempPosts = [
//       { id: 1, title: "첫 번째 게시물", content: "이것은 첫 번째 게시물입니다." },
//       { id: 2, title: "두 번째 게시물", content: "이것은 두 번째 게시물입니다." },
//       { id: 3, title: "세 번째 게시물", content: "이것은 세 번째 게시물입니다." },
//     ];
//     setPosts(tempPosts);
//   }, []);

//   return (
//     <div className="post-container">
//       <h1>게시물 목록</h1>
//       <button
//         onClick={(e) => navigateSafely(e, "/post-creator")}
//         className="write-button"
//       >
//         글쓰기
//       </button>
//       {posts.length > 0 ? (
//         <ul className="post-list">
//           {posts.map((post) => (
//             <li
//               key={post.id}
//               onClick={(e) => navigateSafely(e, `/posts/${post.id}`)}
//               className="post-item"
//             >
//               <h3>{post.title}</h3>
//               <p>{post.content}</p>
//             </li>
//           ))}
//         </ul>
//       ) : (
//         <p className="no-posts-message">게시물이 없습니다.</p>
//       )}
//     </div>
//   );
// };

// export default Post;
