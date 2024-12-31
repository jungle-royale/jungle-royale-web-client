import { useState, useEffect } from "react";
import { fetchStoreData, purchaseItem } from "../api";
import "./Store.css";

const Store = () => {
  const [userData, setUserData] = useState({ username: "", gameMoney: 0, inventory: [] });
  const [items, setItems] = useState([]);

  const handlePurchase = async (itemCode) => {
    try {
      await purchaseItem(itemCode);
      alert("구매가 완료되었습니다!");
      window.location.reload(); // 새로고침
    } catch (error) {
      alert("구매 중 오류가 발생했습니다.");
      console.error(error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchStoreData();
        console.log(data);
        const { username, gameMoney } = data.userInfo;
        const {items, inventory} = data;
        setUserData({ 
          username, 
          gameMoney, 
          inventory: inventory || [] // inventory가 없을 경우 기본값으로 빈 배열 설정
        });
        setItems(items || []);
      } catch (error) {
        console.error("데이터를 가져오는 중 오류 발생:", error);
        setItems([]);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="store-container">
      <div className="user-info">
        <h2>유저 정보</h2>
        <p>닉네임: {userData.username}</p>
        <p>게임머니: {userData.gameMoney}₩</p>
      </div>

      <div className="item-list">
        <h2>아이템 목록</h2>
        {Array.isArray(items) && items.length > 0 ? (
          items.map((item, index) => {
            const isOwned = Array.isArray(userData.inventory) && userData.inventory.some(inv => inv.itemCode === item.itemCode); // 배열 여부 확인
            return (
              <div key={index} className="item-card">
                <h3>{item.name}</h3>
                <p>가격: {item.price}₩</p>
                <button 
                  onClick={() => handlePurchase(item.itemCode)} 
                  disabled={isOwned} // 보유한 아이템일 경우 버튼 비활성화
                >
                  {isOwned ? "품절" : "구매"}
                </button>
              </div>
            );
          })
        ) : (
          <p>아이템이 없습니다.</p>
        )}
      </div>
    </div>
  );
};

export default Store;
