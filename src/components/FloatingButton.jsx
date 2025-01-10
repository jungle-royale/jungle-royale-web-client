import { useState } from "react";

const FloatingButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-4 right-4 flex flex-col items-end space-y-2">
      {isOpen && (
        <>
          <button className="w-12 h-12 bg-green-500 text-white rounded-full shadow-lg">
            A
          </button>
          <button className="w-12 h-12 bg-red-500 text-white rounded-full shadow-lg">
            B
          </button>
        </>
      )}
      <button
        className="w-16 h-16 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 transition"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? "×" : "+"}
      </button>
    </div>
  );
};

export default FloatingButton;
