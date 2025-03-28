import { useEffect } from "react";

const useGlobalEventHandler = () => {
  useEffect(() => {
    const preventDragHandler = (event) => {
      event.preventDefault();
    };
    const preventContextMenuHandler = (event) => {
      event.preventDefault();
    }
    // const preventSelectionHandler = (event) => {
    //   event.preventDefault();
    // } // 입력칸 오류로 인해 제거 예정
  
    window.addEventListener("dragstart", preventDragHandler); //드래그 방지
    // window.addEventListener("mousedown", preventSelectionHandler);  //드래그 방지
    window.addEventListener("contextmenu", preventContextMenuHandler);  //우클릭 방지
  
    return () => {
      window.removeEventListener("dragstart", preventDragHandler);
      // window.removeEventListener("mousedown", preventSelectionHandler);
      window.removeEventListener("contextmenu", preventContextMenuHandler);
    }
  }, []);
}

export default useGlobalEventHandler;