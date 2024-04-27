import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

interface Yeti {
  id: number;
  name: string;
  height: number;
  weight: number;
  location: string;
  photo_url: string;
  gender: string;
}

const YetiDetail = (): JSX.Element => {
  const { id } = useParams<{ id: string }>();
  const [yeti, setYeti] = useState<Yeti | null>(null);
  const [comment, setReview] = useState<string>('');
  const [rating, setRating] = useState<number>(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchYeti = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/yeti/get/${id}`);
        setYeti(response.data);
      } catch (error) {
        console.error('Error fetching yeti details:', error);
      }
    };
  
    fetchYeti();
  }, [id]);
  
  const handleDelete = async () => {
    try {
      await axios.post(`http://127.0.0.1:8000/yeti/delete/${id}`);
      navigate('/');
    } catch (error) {
      console.error('Error deleting yeti:', error);
    }
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.post(`http://127.0.0.1:8000/review/addReview`, {
        yetiId: id,
        comment,
        rating,
      });
      console.log('Review submitted:', response.data);
      setReview('');
      setRating(0);
    } catch (error) {
      console.error('Error submitting review:', error);
    }
  };

  if (!yeti) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <img src={yeti.photo_url} className="card-img-top" alt={yeti.name} />
            <div className="card-body">
              <h5 className="card-title">{yeti.name}</h5>
              <p className="card-text">Height: {yeti.height} cm</p>
              <p className="card-text">Weight: {yeti.weight} kg</p>
              <p className="card-text">Location: {yeti.location}</p>
              <p className="card-text">Gender: {yeti.gender}</p>
              <div className="form-group">
                <label htmlFor="review">Review:</label>
                <textarea
                  id="review"
                  className="form-control"
                  value={comment}
                  onChange={(e) => setReview(e.target.value)}
                ></textarea>
              </div>
              <div className="form-group">
                <label htmlFor="rating">Rating:</label>
                <div>
                  {[...Array(5)].map((_, index) => (
                    <span
                      key={index}
                      onClick={() => setRating(index + 1)}
                      style={{ cursor: 'pointer', color: index < rating ? '#ffc107' : '#e4e5e9' }}
                    >
                      &#9733;
                    </span>
                  ))}
                </div>
              </div>
              <button className="btn btn-primary" onClick={handleSubmit}>Submit</button>
              <button className="btn btn-danger ml-2" onClick={handleDelete}>Delete</button>
            </div>
          </div>
          <Link to="/" className="btn btn-primary mt-3">Back</Link>
        </div>
      </div>
    </div>
  );
};

export default YetiDetail;

