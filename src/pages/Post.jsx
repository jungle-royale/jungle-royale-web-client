import { useEffect, useState } from "react";
import { fetchPosts } from "../api.js";
import useSafeNavigation from "../hooks/useSafeNavigation.jsx";
import "./Post.css"; 

const Post = () => {
  const [posts, setPosts] = useState([]); // 초기값 빈 배열
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지 번호
  const [postsPerPage] = useState(10); // 한 페이지당 게시물 수
  const [totalPosts, setTotalPosts] = useState(0); // 전체 게시물 수 초기값 0
  const { navigateSafely } = useSafeNavigation();

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const response = await fetchPosts({ page: currentPage });
        const fetchedPosts = response.data.data || [];
        const total = response.data.total || 0;
        console.log("fetchedPosts: ", fetchedPosts);
        console.log("total: ", total);

        setPosts(fetchedPosts);
        setTotalPosts(total);
      } catch (error) {
        console.error("게시물을 불러오는 중 오류 발생:", error);
        setPosts([]); // 오류 시 빈 배열 설정
        setTotalPosts(0); // 오류 시 전체 게시물 수 0으로 설정
      }
    };

    loadPosts();
  }, [currentPage]);

  const totalPages = Math.ceil(totalPosts / postsPerPage) || 1; // 안전하게 기본값 1 설정

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  console.log("totalPosts:", totalPosts);
  console.log("postsPerPage:", postsPerPage);
  console.log("totalPages:", totalPages);


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
          {posts.map((post, index) => {
            // 게시물 번호 계산
            const postNumber = (currentPage - 1) * postsPerPage + index + 1;
            return (
              <li
                key={post.id}
                onClick={(e) => navigateSafely(e, `/posts/${post.id}`)}
                className="post-item"
              >
                <h3>{postNumber}. {post.title}</h3>
                <p>{post.content}</p>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="no-posts-message">게시물이 없습니다.</p>
      )}

      {/* 페이지네이션 */}
      <div className="pagination">
        {totalPages > 1 &&
          [...Array(totalPages)].map((_, index) => (
            <button
              key={index}
              className={`page-button ${
                currentPage === index + 1 ? "active" : ""
              }`}
              onClick={() => handlePageChange(index + 1)}
            >
              {index + 1}
            </button>
          ))}
      </div>
    </div>
  );
};

export default Post;
