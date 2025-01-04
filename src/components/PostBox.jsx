import { useEffect, useState } from "react";
import { fetchPosts } from "../api.js";
import useSafeNavigation from "../hooks/useSafeNavigation.jsx";
import { useLoginContext } from "../contexts/LoginContext.jsx";
import { formatDistanceToNowStrict, parseISO } from "date-fns";
import { ko } from "date-fns/locale"; // 한국어 로케일
import "./PostBox.css"; 

const PostBox = () => {
  const [posts, setPosts] = useState([]); // 초기값 빈 배열
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지 번호
  const [postsPerPage] = useState(10); // 한 페이지당 게시물 수
  const [totalPosts, setTotalPosts] = useState(0); // 전체 게시물 수 초기값 0
  const { isLogin } = useLoginContext(); // LoginContext에서 로그인 상태 가져오기
  const { navigateSafely } = useSafeNavigation();

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const response = await fetchPosts({ page: currentPage, limit: postsPerPage });
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

  const formatDate = (isoString) => {
    const now = new Date();
    const postDate = parseISO(isoString);
  
    const differenceInSeconds = Math.floor((now - postDate) / 1000);
  
    // 1분 미만이면 초 단위로 표시
    if (differenceInSeconds < 60) {
      return `${differenceInSeconds}초 전`;
    }
  
    // 오늘 작성된 글이라면 "몇 분 전", "몇 시간 전" 등 표시
    if (postDate.toDateString() === now.toDateString()) {
      return formatDistanceToNowStrict(postDate, { addSuffix: true, locale: ko });
    }
  
    // 오늘 이전 글은 날짜만 표시
    return isoString.split("T")[0];
  };

  const totalPages = Math.ceil(totalPosts / postsPerPage) || 1; // 안전하게 기본값 1 설정

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="post-container">
      <h1>게시판</h1>
      <h3>소중한 의견을 남겨주세요!</h3>
      {isLogin && (
        <button
          onClick={(e) => navigateSafely(e, "/post-creator")}
          className="post-write-button"
        >
          글쓰기
        </button>
      )}
      {posts.length > 0 ? (
        <ul className="post-list">
          {/* 헤더 부분 */}
          <li className="post-header">
            <div>번호</div>
            <div>제목</div>
            <div>작성자</div>
            <div>날짜</div>
          </li>
          {posts
            .map((post, index) => {
              const postNumber = (currentPage - 1) * postsPerPage + index + 1;
              return (
                <li key={post.id} className="post-item">
                  <div>{postNumber}</div>
                  <div
                    onClick={(e) => navigateSafely(e, `/posts/${post.id}`)}
                    className="post-title"
                  >
                    {post.title}
                  </div>
                  <div>{post.username}</div>
                  <div>{formatDate(post.createdAt)}</div>
                </li>
              );
            })}
        </ul>
      ) : (
        <p className="no-posts-message">게시물이 없습니다.</p>
      )}

      {/* 페이지네이션 */}
      <div className="post-pagination">
        {totalPages > 1 &&
          [...Array(totalPages)].map((_, index) => (
            <button
              key={index}
              className={`post-page-button ${
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

export default PostBox;
