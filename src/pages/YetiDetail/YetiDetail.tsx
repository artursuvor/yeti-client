import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import Yetinder from '../../components/Yetinder/Yetinder';
import { Yeti } from '../../types/types';
import axios from 'axios';
import './YetiDetail.css';

const YetiDetail = (): JSX.Element => {
  const { id } = useParams<{ id: string }>();
  const [yeti, setYeti] = useState<Yeti | null>(null);
  const [comment, setComment] = useState<string>('');
  const [rating, setRating] = useState<number>(0);
  const [reviews, setReviews] = useState<{ comment: string; rating: number }[]>([]);
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
  const averageRating = reviews.length > 0 ? totalRating / reviews.length : 0;

  if (!yeti) {
    return <div>Loading...</div>;
  }
  return (
    <div className="container-yeti-detail">
      <div className="row">
        {/* Yeti Details */}
        <div className="col-md-4 card">
          <div className="card-body">
            {yeti.photo_url ? (
              <img src={yeti.photo_url} alt="Yeti Photo" className="card-img-top personal-photo" />
            ) : (
              <div className="default-photo">Y</div>
            )}
            <h5 className="card-title">{yeti.name}</h5>
            <p className="card-text">Height: {yeti.height} cm</p>
            <p className="card-text">Weight: {yeti.weight} kg</p>
            <p className="card-text">Location: {yeti.location}</p>
            <p className="card-text">Gender: {yeti.gender}</p>
          </div>
        </div>
        {/* Reviews */}
        <div className="col-md-4 card">
          <div className="card-body">
            <p className="mb-3">Reviews:</p>
            <ul style={{ maxHeight: '200px', overflow: 'auto' }}>
              {reviews.map((review, index) => (
                <div className="card mb-3" key={index}>
                  <div className="card-body">
                    <p className="mb-1">'{review.comment}'</p>
                    <p className="mb-0">Rating: {review.rating}</p>
                  </div>
                </div>
              ))}
            </ul>
            <p className="mb-1">Average Rating: {averageRating.toFixed(1)}</p>
            <div className="form-group">
              <label htmlFor="comment">Comment:</label>
              <textarea
                id="comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="form-control"
              ></textarea>
            </div>
            <div className="form-group">
              <label htmlFor="rating">Rating:</label>
              <div className="rating-container">
                {[...Array(5)].map((_, index) => (
                  <span
                    key={index}
                    onClick={() => setRating(index + 1)}
                    className={index < rating ? 'active' : ''}
                  >
                    &#9733;
                  </span>
                ))}
              </div>
            </div>
            <button className="btn btn-primary" onClick={handleSubmit}>
              Submit Review
            </button>
            <button className="btn btn-danger ml-2" onClick={handleDelete}>
              Delete Yeti
            </button>
          </div>
        </div>
        {/* Yetinder */}
        <div className="col-md-3 card">
          <div className="card-body">
            <Yetinder averageRating={averageRating} />
          </div>
        </div>
        {/* Back Button */}
        <div className="col-md-12 mt-3">
          <Link to="/" className="btn btn-primary">
            Back
          </Link>
        </div>
      </div>
    </div>
  );
};

export default YetiDetail;
