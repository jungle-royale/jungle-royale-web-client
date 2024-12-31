import { useState, useEffect } from "react";
import { fetchStoreData, purchaseItem } from "../api"; // API 함수 추가
import "./Store.css"

const Store = () => {
  // const [userData, setUserData] = useState({ nickname: "", gameMoney: 0 });
  const [userData, setUserData] = useState({ username:"", gameMoney: 0 });
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
        const username = data.userInfo.username;
        const gameMoney = data.userInfo.gameMoney;
        const items = data.items;
        setUserData({ username, gameMoney });
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
          items.map((item, index) => (
            <div key={index} className="item-card">
              <h3>{item.name}</h3>
              <p>가격: {item.price}₩</p>
              <button onClick={() => handlePurchase(item.itemCode)}>구매</button>
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
