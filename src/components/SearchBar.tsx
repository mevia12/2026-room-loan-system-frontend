import { useState } from "react";
import "../index.css";


type Props = {
  onSearch: (keyword: string) => void;
};

export default function SearchBar({ onSearch }: Props) {
  const [keyword, setKeyword] = useState("");

  return (
    <div className="search-container">
      <input
        type="text"
        placeholder="Cari nama / ruangan"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        onKeyUp={(e) => e.key === "Enter" && onSearch(keyword)}
      />
      <button onClick={() => onSearch(keyword)}>
        <i className="fas fa-search" color="white"></i>
      </button>
    </div>
  );
}
