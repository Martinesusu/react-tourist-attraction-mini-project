import "./App.css";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaShareAlt } from "react-icons/fa";

function App() {
  const [searchQuery, setSearchQuery] = useState(""); 
  const [allPlaces, setAllPlaces] = useState([]);
  const [filteredPlaces, setFilteredPlaces] = useState([]);
  const [iconSize, setIconSize] = useState(22); 
  const [buttonSize, setButtonSize] = useState(44);
  const [error, setError] = useState(null); 

  // Fetch ข้อมูลทั้งหมดเมื่อเริ่มต้น
  useEffect(() => {
    const fetchAllPlaces = async () => {
      try {
        const response = await axios.get("http://localhost:4001/trips");
        setAllPlaces(response.data.data); 
        setError(null); 
      } catch (error) {
        console.error("Error fetching all data:", error);
        setError("Failed to fetch places. Please try again.");
      }
    };

    fetchAllPlaces();
  }, []);

  // หน่วงเวลาในการกรอกข้อมูลฝั่ง client
  useEffect(() => {
    const debounceTimeout = setTimeout(() => {
      const lowerCaseQuery = searchQuery.toLowerCase();
      const filtered = allPlaces.filter((place) => {
        const inTitle = place.title.toLowerCase().includes(lowerCaseQuery);
        const inDescription = place.description
          .toLowerCase()
          .includes(lowerCaseQuery);
        const inTags = place.tags.some((tag) =>
          tag.toLowerCase().includes(lowerCaseQuery)
        );
        return inTitle || inDescription || inTags;
      });

      setFilteredPlaces(filtered);
    }, 500);

    return () => clearTimeout(debounceTimeout);
  }, [searchQuery, allPlaces]);

  // ฟังก์ชันเมื่อคลิกแท็ก
  const handleTagClick = (tag) => {
    setSearchQuery(tag);
  };

  // รีเซ็ตค่าช่องค้นหา
  const handleClearSearch = () => {
    setSearchQuery(""); 
  };

  const handleCopyLink = (url) => {
    navigator.clipboard.writeText(url).then(() => {
      toast.success("Link copied to clipboard!");
    });
  };

  useEffect(() => {
    const updateSize = () => {
      const width = window.innerWidth;
      if (width <= 480) {
        setIconSize(16); // ขนาดสำหรับ Mobile
        setButtonSize(38);
      } else if (width <= 768) {
        setIconSize(18); // ขนาดสำหรับ Tablet
        setButtonSize(40);
      } else {
        setIconSize(22); // ขนาดสำหรับ Desktop
        setButtonSize(44);
      }
    };

    updateSize(); 
    window.addEventListener("resize", updateSize); 
    return () => window.removeEventListener("resize", updateSize); 
  }, []);

  return (
    <>
      <div className="tourist-container">
        <div className="header">
          <h1 className="header">เที่ยวไหนดี</h1>
        </div>
        <div className="search-input-container">
          <p>ค้นหาที่เที่ยว</p>
          <div className="input-container">
            <input
              type="text"
              placeholder="หาที่เที่ยวแล้วไปกัน ..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            <button onClick={handleClearSearch} className="clear-button">
              Clear
            </button>
          </div>
        </div>
        <div className="place-list-container">
          {error ? (
            <p>{error}</p>
          ) : filteredPlaces.length > 0 ? (
            filteredPlaces.map((item, index) => (
              <div key={index} className="place-item">
                <div className="place-photo">
                  <img src={item.photos[0]} alt={item.title} />
                </div>
                <div className="place-info">
                  <h3 className="place-title">{item.title}</h3>
                  <p className="place-description">{item.description}</p>
                  <a href={item.url}>อ่านต่อ</a>
                  <div className="place-tags">
                    <p className="place-tags-header">หมวด</p>
                    <div className="tags-container">
                      {item.tags.map((tag, idx) => (
                        <span key={idx} className="tag" onClick={() => handleTagClick(tag)}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  {/* แสดงภาพที่ 2, 3, 4 */}
                  <div className="extra-photos">
                    {item.photos.slice(1).map((photo, index) => (
                      <img
                        key={index}
                        src={photo}
                        alt={`${item.title} Photo ${index + 2}`}
                      />
                    ))}
                  </div>
                  <div className="copy-link-container">
                    <button
                      className="share-button"
                      style={{
                        width: `${buttonSize}px`,
                        height: `${buttonSize}px`,
                        borderRadius: "50%",
                        backgroundColor: "#e3f2fd",
                      }}
                      onClick={() => handleCopyLink("https://example.com")}
                    >
                      <FaShareAlt size={iconSize} color="#2196F3" />
                    </button>
                    <ToastContainer />
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p>No results found</p>
          )}
        </div>
      </div>
    </>
  );
}

export default App;
