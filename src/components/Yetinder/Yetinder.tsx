import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import { Yeti, Review, YetinderProps } from '../../types/types'
import { calculateAverageRating } from '../../functions/calculateAverageRating';

const Yetinder = ({ averageRating }: YetinderProps): JSX.Element => {
  const [yetiList, setYetiList] = useState([] as Yeti[]);
  const [reviews, setReviews] = useState<{ [key: number]: Review[] }>({});
  const [genderFilter, setGenderFilter] = useState<string | null>(null);
  const { id: currentYetiId } = useParams<{ id: string }>(); 

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

  const filteredYetiList = yetiList.filter((yeti) => {
    const yetiAverageRating = calculateAverageRating(reviews[yeti.id]);
    const meetsRatingCriteria = Math.abs(yetiAverageRating - averageRating) <= 0.5;
    const meetsGenderCriteria = genderFilter ? yeti.gender === genderFilter : true;
    const isCurrentYeti = yeti.id.toString() === currentYetiId;
    return meetsRatingCriteria && meetsGenderCriteria && !isCurrentYeti; 
  });
  
  return (
    <div className="container">
      <div>
        <p>Yeti That Finds You Well</p>
        <ul style={{ maxHeight: '300px', overflow: 'auto' }}>
          {filteredYetiList.map((yeti: Yeti) => (
            <div className='card' key={yeti.id}>
              {yeti.photo_url ? (
                <img src={yeti.photo_url} alt="Yeti Photo" className='personal-photo'/>
              ) : (
                <div className="default-photo">Y</div>
              )}
              <p>Name: {yeti.name}</p>
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
        <div>
          <button onClick={() => setGenderFilter(null)}>All</button>
          <button onClick={() => setGenderFilter('M')}>Male</button>
          <button onClick={() => setGenderFilter('W')}>Female</button>
        </div>
      </div>
    </div>
  );

};

export default Yetinder;
