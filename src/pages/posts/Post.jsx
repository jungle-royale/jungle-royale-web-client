import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchPosts } from "../../api.js";
import { useLoginContext } from "../../contexts/LoginContext.jsx";
import log from 'loglevel';
import { formatDistanceToNowStrict, parseISO } from "date-fns";
import { ko } from "date-fns/locale";

const Post = () => {
  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(10);
  const [totalPosts, setTotalPosts] = useState(0);
  const { isLogin } = useLoginContext();
  const navigate = useNavigate();

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const response = await fetchPosts({ page: currentPage, limit: postsPerPage });
        const fetchedPosts = response.data.data || [];
        const total = response.data.total || 0;
        setPosts(fetchedPosts);
        setTotalPosts(total);
      } catch (error) {
        log.error("게시물을 불러오는 중 오류 발생:", error);
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

  const navigateSafely = (event, path) => {
    event.preventDefault();
    navigate(path);
  };

  return (
    <div
      className="min-h-[100dvh] bg-cover bg-center"
      style={{ backgroundImage: `url(/assets/snowy_background.png)` }}
    >
      {/* 어두운 오버레이 */}
      <div className="absolute inset-0 bg-black bg-opacity-30 z-0"></div>

      <div className="min-h-[100dvh] pt-20">
        <div className="relative max-w-5xl mx-auto p-6 bg-white bg-opacity-90 rounded-lg shadow-lg z-10">
          <div className="mb-6 text-center">
            <h1 className="text-3xl font-bold text-gray-800">게시판</h1>
            <h3 className="text-lg text-gray-600">소중한 의견을 남겨주세요!</h3>
            {isLogin && (
              <button
                onClick={(e) => navigateSafely(e, "/post-creator")}
                className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition"
              >
                글쓰기
              </button>
            )}
          </div>
          {posts.length > 0 ? (
            <ul className="divide-y divide-gray-200">
              <li className="flex justify-between px-4 py-2 font-bold bg-gray-200">
                <div className="w-2/12 min-w-[40px] text-center">번호</div>
                <div className="w-10/12 min-w-[220px]">제목</div>
              </li>
              {posts.map((post, index) => {
                const postNumber = (currentPage - 1) * postsPerPage + index + 1;
                return (
                  <li
                    key={post.id}
                    className="flex justify-between px-4 py-2 hover:bg-gray-100 transition"
                  >
                    <div className="w-2/12 min-w-[40px] text-center">{postNumber}</div>
                    <div className="w-10/12 min-w-[220px]">
                      <div
                        onClick={(e) => navigateSafely(e, `/posts/${post.id}`)}
                        className="text-blue-500 hover:underline cursor-pointer"
                      >
                        {post.title}
                      </div>
                      <div className="text-sm text-gray-500">
                        {post.username} | {formatDate(post.createdAt)}
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="text-center text-gray-500">게시물이 없습니다.</p>
          )}
          <div className="flex justify-center mt-6">
            {totalPages > 1 &&
              [...Array(totalPages)].map((_, index) => (
                <button
                  key={index}
                  className={`mx-1 px-3 py-1 rounded-full ${
                    currentPage === index + 1
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-700"
                  } hover:bg-blue-400 hover:text-white transition`}
                  onClick={() => handlePageChange(index + 1)}
                >
                  {index + 1}
                </button>
              ))}
          </div>
        </div>
      </div>

    </div>
  );
};

export default Post;
