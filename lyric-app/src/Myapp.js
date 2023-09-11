import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import ProfileUpdate from './profileUpdate'; 
import Passwordupdate from './passwordupdate'; 

function MyApp() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<ProfileUpdate />} />
          <Route path="/password" element={<Passwordupdate />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default MyApp;
