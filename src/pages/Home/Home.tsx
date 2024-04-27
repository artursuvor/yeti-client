import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

interface Yeti {
  id: number;
  name: string;
  height: number;
  weight: number;
  location: string;
  photo_url: string;
  gender: string;
  reviewsCount: number; 
  averageRating: number;
}

interface Review {
  text: string;
  rating: number;
}

const Home: React.FC = () => {
  const [yetiList, setYetiList] = useState<Yeti[]>([]); 
  const [reviews, setReviews] = useState<{[key: number]: Review[]}>({});

  useEffect(() => {
      const fetchYetiList = async () => {
        try {
          const response = await axios.get('http://127.0.0.1:8000/yeti/list');
          setYetiList(response.data);
        } catch (error) {
          console.error('Error fetching yeti list:', error);
        }
      };

      fetchYetiList();
  }, []);

  useEffect(() => {
    const fetchYetiList = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/yeti/list');
        setYetiList(response.data);
  
        const promises = response.data.map(async (yeti: Yeti) => {
          try {
            const reviewResponse = await axios.get(`http://127.0.0.1:8000/review/get_all_for_yeti/${yeti.id}`);
            // Сохраняем отзывы в состоянии компонента
            setReviews(prevReviews => ({
              ...prevReviews,
              [yeti.id]: reviewResponse.data
            }));
          } catch (error) {
            console.error('Error fetching reviews for yeti:', error);
          }
        });
        await Promise.all(promises);
      } catch (error) {
        console.error('Error fetching yeti list:', error);
      }
    };
  
    fetchYetiList();
  }, []);
  

  const [showPopup, setShowPopup] = useState(false);
  const [newYetiData, setNewYetiData] = useState({
    name: '',
    height: '',
    weight: '',
    location: '',
    photo_url: '',
    gender: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewYetiData({ ...newYetiData, [name]: value });
  };

  const handleSubmit = async () => {
    try {
      await axios.post('http://127.0.0.1:8000/yeti/add', newYetiData);
      setShowPopup(false);
      const response = await axios.get('http://127.0.0.1:8000/yeti/list');
      setYetiList(response.data);
    } catch (error) {
      console.error('Error creating yeti:', error);
    }
  }  
  
  const calculateAverageRating = (reviews: Review[] | undefined) => {
    if (!reviews || reviews.length === 0) return 0;
  
    const totalRating = reviews.reduce((acc, review) => acc + review.rating, 0);
    return totalRating / reviews.length;
  };

  return (
    <div className="container">
      <div>
        <h1>Yeti List</h1>
        <ul>
        {yetiList.map((yeti: Yeti) => (
          <div className='card' key={yeti.id}>
            <li>
              Name: {yeti.name}, 
              {/* Height: {yeti.height}, 
              Weight: {yeti.weight},
              Location: {yeti.location},
              Gender: {yeti.gender} */}
            </li>
            <p>Reviews Count: {reviews[yeti.id] ? reviews[yeti.id].length : 0}</p>
            <p>Average Rating: {calculateAverageRating(reviews[yeti.id])}</p>
            <Link
              to={`/yeti/get/${yeti.id}`}
              className="btn btn-primary"
            >
              View Details
            </Link>
          </div>
        ))}
        </ul>
      </div>
      <div>
        <button onClick={() => setShowPopup(true)}>Add Yeti</button>
        {showPopup && (
          <div className="popup">
            <div className="popup-content">
              <span className="close" onClick={() => setShowPopup(false)}>×</span>
              <h2>Add New Yeti</h2>
              <input type="text" name="name" value={newYetiData.name} onChange={handleInputChange} placeholder="Name" />
              <input type="text" name="height" value={newYetiData.height} onChange={handleInputChange} placeholder="Height" />
              <input type="text" name="weight" value={newYetiData.weight} onChange={handleInputChange} placeholder="Weight" />
              <input type="text" name="location" value={newYetiData.location} onChange={handleInputChange} placeholder="Location" />
              <input type="text" name="photo_url" value={newYetiData.photo_url} onChange={handleInputChange} placeholder="Photo URL" />
              <input type="text" name="gender" value={newYetiData.gender} onChange={handleInputChange} placeholder="Gender" />
              <button onClick={handleSubmit}>Create Yeti</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
  
};

export default Home;
