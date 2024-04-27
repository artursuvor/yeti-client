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
  const [yeti, setYeti] = useState  <Yeti | null>(null);
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
              <button className="btn btn-danger" onClick={handleDelete}>Delete</button>
            </div>
          </div>
          <Link to="/" className="btn btn-primary">Back</Link>
        </div>
      </div>
    </div>
  );
};

export default YetiDetail;

