import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';

interface Yeti {
  id: number;
  name: string;
  height: number;
  weight: number;
  location: string;
  photo_url: string;
  gender: string;
}

interface Review {
  text: string;
  rating: number;
}

interface YetinderProps {
  averageRating: number;
}

const Yetinder = ({ averageRating }: YetinderProps): JSX.Element => {
  const [yetiList, setYetiList] = useState([] as Yeti[]);
  const [reviews, setReviews] = useState<{ [key: number]: Review[] }>({});
  const [genderFilter, setGenderFilter] = useState<string | null>(null);
  const { id: currentYetiId } = useParams<{ id: string }>(); // Получаем id текущего Yeti из адресной строки

  useEffect(() => {
    const fetchYetiList = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/yeti/list');
        setYetiList(response.data);

        const promises = response.data.map(async (yeti: Yeti) => {
          try {
            const reviewResponse = await axios.get(`http://127.0.0.1:8000/review/get_all_for_yeti/${yeti.id}`);
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

  const calculateAverageRating = (reviews: Review[] | undefined) => {
    if (!reviews || reviews.length === 0) return 0;
  
    const totalRating = reviews.reduce((acc, review) => acc + review.rating, 0);
    return totalRating / reviews.length;
  };

  const filteredYetiList = yetiList.filter((yeti) => {
    const yetiAverageRating = calculateAverageRating(reviews[yeti.id]);
    const meetsRatingCriteria = Math.abs(yetiAverageRating - averageRating) <= 0.5;
    const meetsGenderCriteria = genderFilter ? yeti.gender === genderFilter : true;
    const isCurrentYeti = yeti.id.toString() === currentYetiId; // Проверяем, является ли текущий Yeti тем, который мы просматриваем
    return meetsRatingCriteria && meetsGenderCriteria && !isCurrentYeti; // Пропускаем текущий Yeti при фильтрации
  });
  
  return (
    <div className="container">
      <div>
        <h1>Yeti List {averageRating}</h1>
        <div>
          <button onClick={() => setGenderFilter(null)}>All</button>
          <button onClick={() => setGenderFilter('M')}>Male</button>
          <button onClick={() => setGenderFilter('W')}>Female</button>
        </div>
        <ul>
          {filteredYetiList.map((yeti: Yeti) => (
            <div className='card' key={yeti.id}>
              <li>
                Name: {yeti.name},
                <p>Average Rating: {calculateAverageRating(reviews[yeti.id])}</p>
              </li>
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
    </div>
  );

};

export default Yetinder;
