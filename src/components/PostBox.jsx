import { useEffect, useState, useRef } from "react";
import { fetchPosts } from "../api.js";
import useSafeNavigation from "../hooks/useSafeNavigation.jsx";
import { useLoginContext } from "../contexts/LoginContext.jsx";
import { formatDistanceToNowStrict, parseISO } from "date-fns";
import { ko } from "date-fns/locale";
import "./PostBox.css";
// import log from "loglevel";

const PostBox = () => {
  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(10);
  const [totalPosts, setTotalPosts] = useState(0);
  const [isSticky, setIsSticky] = useState(false);
  const [isVisible, setIsVisible] = useState(false); // 박스 보임 상태
  const containerRef = useRef(null);
  const { isLogin } = useLoginContext();
  const { navigateSafely } = useSafeNavigation();

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const response = await fetchPosts({ page: currentPage, limit: postsPerPage });
        const fetchedPosts = response.data.data || [];
        const total = response.data.total || 0;
        setPosts(fetchedPosts);
        setTotalPosts(total);
      } catch (error) {
        console.error("게시물을 불러오는 중 오류 발생:", error);
        setPosts([]);
        setTotalPosts(0);
      }
    };

    loadPosts();
  }, [currentPage]);

  const formatDate = (isoString) => {
    const now = new Date();
    const postDate = parseISO(isoString);

    const differenceInSeconds = Math.floor((now - postDate) / 1000);

    if (differenceInSeconds < 60) {
      return `${differenceInSeconds}초 전`;
    }

    if (postDate.toDateString() === now.toDateString()) {
      return formatDistanceToNowStrict(postDate, { addSuffix: true, locale: ko });
    }

    return isoString.split("T")[0];
  };

  const totalPages = Math.ceil(totalPosts / postsPerPage) || 1;

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (containerRef.current && !isSticky) {
        const rect = containerRef.current.getBoundingClientRect();
        if (rect.top <= 50) {
          setIsSticky(true); // 특정 위치에서 고정
        }
        setIsVisible(rect.top < window.innerHeight && rect.bottom > 0); // 박스가 화면에 보이는지 확인
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isSticky]);

  const handleHomeClick = () => {
    setIsSticky(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleScrollToTop = () => {
    if (containerRef.current && isVisible) {
      const containerScrollTop = containerRef.current.scrollTop;
      if (containerScrollTop === 0) {
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        containerRef.current.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
  };

  return (
    <div>
      <div
        ref={containerRef}
        className={`post-container ${isSticky ? "sticky" : ""}`}
        onClick={handleScrollToTop} // PostBox를 클릭하면 함수 실행
      >
        <div className="post-container-header">
          <h1>게시판</h1>
          <h3>소중한 의견을 남겨주세요!</h3>
          {isSticky && (
            <button onClick={handleHomeClick} className="home-button">
              홈으로
            </button>
          )}
          {isLogin && (
            <button
              onClick={(e) => navigateSafely(e, "/post-creator")}
              className="post-write-button"
            >
              글쓰기
            </button>
          )}
        </div>
        {posts.length > 0 ? (
          <ul className="post-list">
            <li className="post-header">
              <div className="post-header-num">번호</div>
              <div className="post-header-title">제목</div>
            </li>
            {posts.map((post, index) => {
              const postNumber = (currentPage - 1) * postsPerPage + index + 1;
              return (
                <li key={post.id} className="post-item">
                  <div className="post-num">{postNumber}</div>
                  <div className="post-content">
                    <div
                      onClick={(e) => navigateSafely(e, `/posts/${post.id}`)}
                      className="post-title"
                    >
                      {post.title}
                    </div>
                    <div className="post-author-date-container">
                      <div className="post-author">
                        {post.username} | {formatDate(post.createdAt)}
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="no-posts-message">게시물이 없습니다.</p>
        )}
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
    </div>
  );
};

export default PostBox;
