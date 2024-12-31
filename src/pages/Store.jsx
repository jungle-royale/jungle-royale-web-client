import { useState, useEffect } from "react";
import { fetchStoreData, purchaseItem } from "../api";
//import ThreeCanvas from "../components/ThreeCanvas";
import "./Store.css";

const Store = () => {
  const [userData, setUserData] = useState({ username: "", gameMoney: 0, inventory: [] });
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handlePurchase = async (itemCode) => {
    setIsLoading(true); // 로딩 상태 활성화
    try {
      // 서버에서 구매 요청 처리
      const updatedUserData = await purchaseItem(itemCode);
      alert("구매가 완료되었습니다!");
      console.log(updatedUserData);
      // 상태 업데이트
      setUserData((prev) => ({
        ...prev,
        gameMoney: updatedUserData.userInfo.gameMoney,
        inventory: [...prev.inventory, updatedUserData.newItem],
      }));

      setItems((prevItems) =>
        prevItems.map((item) =>
          item.itemCode === itemCode ? { ...item, isOwned: true } : item
        )
      );
    } catch (error) {
      alert("구매 중 오류가 발생했습니다.");
      console.error(error);
    } finally {
      setIsLoading(false); // 로딩 상태 비활성화
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchStoreData();
        const { username, gameMoney } = data.userInfo;
        const { items, inventory } = data;

        setUserData({ 
          username, 
          gameMoney, 
          inventory: inventory || [], // inventory가 없을 경우 기본값으로 빈 배열 설정
        });
        setItems(items.map((item) => ({ 
          ...item, 
          isOwned: inventory.some((inv) => inv.itemCode === item.itemCode),
        })));
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
          items.map((item) => (
            <div key={item.itemCode} className="item-card">
              <h3>{item.name}</h3>
              <p>가격: {item.price}₩</p>
              <button 
                onClick={() => handlePurchase(item.itemCode)} 
                disabled={item.isOwned || isLoading} // 이미 구매한 아이템 또는 로딩 중 비활성화
              >
                {item.isOwned ? "품절" : "구매"}
              </button>
            </div>
          ))
        ) : (
          <p>아이템이 없습니다.</p>
        )}
      </div>
    </div>
  );
};

export default Store;
