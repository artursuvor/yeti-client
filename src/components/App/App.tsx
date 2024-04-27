import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from '../../pages/Home/Home';
import YetiDetail from '../../pages/YetiDetail/YetiDetail';
import 'bootstrap/dist/css/bootstrap.min.css';

function App(): JSX.Element {
  return (  
  <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/yeti/get/:id" element={<YetiDetail />} />
      </Routes>
    </BrowserRouter>
  );
}
export default App;
