import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import Yetinder from '../../components/Yetinder/Yetinder';
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

interface Review {
  text: string;
  rating: number;
}

const YetiDetail = (): JSX.Element => {
  const { id } = useParams<{ id: string }>();
  const [yeti, setYeti] = useState<Yeti | null>(null);
  const [comment, setComment] = useState<string>('');
  const [rating, setRating] = useState<number>(0);
  const [reviews, setReviews] = useState<{comment: string, rating: number}[]>([]);
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

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/review/get_all_for_yeti/${id}`);
        setReviews(response.data);
      } catch (error) {
        console.error('Error fetching reviews:', error);
      }
    };

    fetchReviews();
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
      await axios.post(`http://127.0.0.1:8000/review/addReview`, {
        yetiId: id,
        comment,
        rating,
      });
      const response = await axios.get(`http://127.0.0.1:8000/review/get_all_for_yeti/${id}`);
      setReviews(response.data);
      setComment('');
      setRating(0);
    } catch (error) {
      console.error('Error submitting review:', error);
    }
  };

  const totalRating = reviews.reduce((accumulator, review) => accumulator + review.rating, 0);
  const averageRating = totalRating / reviews.length;

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
                <label htmlFor="comment">Comment:</label>
                <textarea
                  id="comment"
                  className="form-control"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
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
              <button className="btn btn-primary" onClick={handleSubmit}>Submit Review</button>
              <button className="btn btn-danger ml-2" onClick={handleDelete}>Delete Yeti</button>
            </div>
          </div>
          <Link to="/" className="btn btn-primary mt-3">Back</Link>
        </div>
      </div>
      <div>
        <h6>Reviews:</h6>
        {reviews.map((review, index) => (
          <div key={index}>
            <p>Text: {review.comment}</p>
            <p>Rating: {review.rating}</p>
          </div>
        ))}
        <div>
          <p>Average Rating: {averageRating}</p>
        </div>
      </div>
      <Yetinder averageRating={averageRating} />
    </div>
  );
};

export default YetiDetail;