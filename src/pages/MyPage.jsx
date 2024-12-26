import useForMember from "../hooks/useNavigateToMypage";

const MyPage = () => {
  useForMember(); // 회원 전용 접근 제한 적용

  return (
    <div>
      <h1>마이페이지</h1>
      <p>회원 전용 페이지입니다.</p>
    </div>
  );

}

export default MyPage;

