import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from '../Layout/Layout';
import Home from '../../pages/Home/Home';
import YetiDetail from '../../pages/YetiDetail/YetiDetail';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'

function App(): JSX.Element {
  return (  
  <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="/yeti/get/:id" element={<YetiDetail />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
export default App;
