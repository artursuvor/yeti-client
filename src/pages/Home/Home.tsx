import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Yeti, Review } from '../../types/types';
import { calculateAverageRating } from '../../functions/calculateAverageRating';
import './Home.css';

const Home: React.FC = () => {
  const [yetiList, setYetiList] = useState<Yeti[]>([]);
  const [reviews, setReviews] = useState<{ [key: number]: Review[] }>({});
  const [showPopup, setShowPopup] = useState(false);
  const [newYetiData, setNewYetiData] = useState({
    name: '',
    height: '',
    weight: '',
    location: '',
    photo_url: '',
    gender: '',
  });
  const [visibleYetiCount, setVisibleYetiCount] = useState(10);

  useEffect(() => {
    const fetchYetiList = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/yeti/list');
        const shuffledYetiList = shuffleArray(response.data);
        setYetiList(shuffledYetiList);
        await fetchReviews(shuffledYetiList.slice(0, visibleYetiCount));
      } catch (error) {
        console.error('Error fetching yeti list:', error);
      }
    };

    fetchYetiList();
  }, [visibleYetiCount]);

  const fetchReviews = async (yetis: Yeti[]) => {
    const promises = yetis.map(async (yeti: Yeti) => {
      try {
        const reviewResponse = await axios.get(`http://127.0.0.1:8000/review/get_all_for_yeti/${yeti.id}`);
        setReviews((prevReviews) => ({
          ...prevReviews,
          [yeti.id]: reviewResponse.data,
        }));
      } catch (error) {
        console.error('Error fetching reviews for yeti:', error);
      }
    });
    await Promise.all(promises);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewYetiData({ ...newYetiData, [name]: value });
  };

  const handleSubmit = async () => {
    try {
      await axios.post('http://127.0.0.1:8000/yeti/add', newYetiData);
      setShowPopup(false);
      const response = await axios.get('http://127.0.0.1:8000/yeti/list');
      setYetiList(shuffleArray(response.data));
    } catch (error) {
      console.error('Error creating yeti:', error);
    }
  };

  const shuffleArray = (array: any[]) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  const renderRatingStars = (rating: number) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      if (i < rating) {
        stars.push(<span key={i}>&#9733;</span>);
      } else {
        stars.push(<span key={i}>&#9734;</span>);
      }
    }
    return stars;
  };

  const handlePopupClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
  };

  return (
    <div className="container">
      <div className="yeti-list-container">
        {yetiList.slice(0, visibleYetiCount).map((yeti: Yeti) => (
          <div className="card" key={yeti.id}>
            {yeti.photo_url ? (
              <img src={yeti.photo_url} alt="Yeti Photo" className='personal-photo'/>
            ) : (
              <div className="default-photo">Y</div>
            )}
            <p className='yetis-name'>{yeti.name}</p>
            <p>
              Rating: {renderRatingStars(calculateAverageRating(reviews[yeti.id] || []))}
              {' ('}
              {reviews[yeti.id] ? reviews[yeti.id].length : 0}
              {')'}
            </p>
            <Link to={`/yeti/get/${yeti.id}`} className="btn btn-primary">
              View Details
            </Link>
          </div>
        ))}
      </div>
      <div className="controls">
        {yetiList.length > visibleYetiCount && (
          <button className="more-button" onClick={() => setVisibleYetiCount(visibleYetiCount + 5)}>More Yeti</button>
        )}
        <button className="add-button" onClick={() => setShowPopup(true)}>Add Yeti</button>
        {showPopup && (
          <div className="popup" onClick={() => setShowPopup(false)}>
            <div className="popup-content" onClick={handlePopupClick}>
              <h2>Add New Yeti</h2>
              <input type="text" name="name" value={newYetiData.name} onChange={handleInputChange} placeholder="Name" />
              <input type="text" name="height" value={newYetiData.height} onChange={handleInputChange} placeholder="Height" />
              <input type="text" name="weight" value={newYetiData.weight} onChange={handleInputChange} placeholder="Weight" />
              <input type="text" name="location" value={newYetiData.location} onChange={handleInputChange} placeholder="Location" />
              <input type="text" name="photo_url" value={newYetiData.photo_url} onChange={handleInputChange} placeholder="Photo URL" />
              <div className="gender-input">
                <label>
                  <input 
                    type="radio" 
                    id="male" 
                    name="gender" 
                    value="M" 
                    checked={newYetiData.gender === "M"} 
                    onChange={handleInputChange} 
                  />
                  M
                </label>
                <label>
                  <input 
                    type="radio" 
                    id="female" 
                    name="gender" 
                    value="W" 
                    checked={newYetiData.gender === "W"} 
                    onChange={handleInputChange} 
                  />
                  W
                </label>
                </div>
              <button className="create-button" onClick={handleSubmit}>Create Yeti</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
