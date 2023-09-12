import './App.css';
import { useState, useEffect } from 'react';
import axios from 'axios';
import React from 'react';
import { useNavigate } from 'react-router-dom';

const AWS = require('aws-sdk');
AWS.config.update({
  accessKeyId: 'AKIAWJUYWBOYMET2Y64D',
  secretAccessKey: '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',
  region: 'Asia Pacific (Mumbai) ap-south-1',
});

function ProfileUpdate() {
  const navigate = useNavigate();
  const [ischanged, setischanged] = useState(false);
  const [changedData, setChangedData] = useState({
    id: '',
    firstname: '',
    secondname: '',
    email: '',
    phone: '',
    role: '',
    language: '',
    image: '',
  });

  useEffect(() => {
    axios.get('http://localhost:3008/')
      .then((response) => {
        if (response.data && response.data.length > 0) {
          const userData = response.data[0];
          setChangedData({
            id: userData.id,
            firstname: userData.firstname,
            secondname: userData.secondname,
            email: userData.email,
            phone: userData.phone,
            role: userData.role,
            language: userData.language,
            image: userData.image,
          });
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }, [ischanged]);

  const handleChanges = (e) => {
    const { name, value } = e.target;
    setChangedData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      await axios.put('http://localhost:3008/editdata', changedData);
      alert('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile data:', error);
    }
    setischanged(!ischanged);
  };

  const handleCancel = () => {
    setischanged(!ischanged);
  };

  const handleClickPassword = () => {
    navigate('/password');
  };
  const handleClickAccount = () => {
    navigate('/');
  };

  

// aws upload
  const [selectedFile, setSelectedFile] = useState();
 // Function to upload the selected image to AWS S3
  const uploadImage = async () => {
    if (!selectedFile) {
      alert('Please select an image to upload');
      return;
    }
// Create a FormData object to send the image file
const formData = new FormData();
formData.append('photos', selectedFile);

try {
  await axios.post('http://localhost:3008/up', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  alert('Image uploaded successfully');
} catch (error) {
  console.error('Error uploading image:', error);
  alert('Image upload failed');
}
await axios.get(`http://localhost:3008/url/${selectedFile.name}`);
setischanged(!ischanged);
};

 // Function to handle file selection
  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };
 
  
  return (
    <div>
      <div className='topbar'>
        <h1><span class="material-symbols-outlined">arrow_back</span>Profile</h1>
        </div>
    <div className='navi'>
        <label htmlFor="fileInput" className="label">
        <span>
          <img id="profile" src={changedData.image ||'./profile.png'} alt='profile' defaultValue="./profile.png" />
          </span>

        </label>
        <input className='none' type="file" id="fileInput" accept="image/*" onChangeCapture={uploadImage} onInputCapture={handleFileChange} required />
      <br></br>

        <button onClick={handleClickAccount}>ACCOUNT</button><br></br>
        <button onClick={handleClickPassword}>PASSWORD</button><br></br>
        <button>SETTINGS</button><br></br>
        <button>LOG OUT</button><br></br>
    </div>
    <div className='secondhalf'>
        <h2>DETAILS</h2>
        <br></br>
        <div className='divide '>
        <div className='both'>   

        <div className='form-row'>        
        <label for="firstname" >First Name </label>
        <input  type="text" name="firstname" id="firstname" value={changedData.firstname} onChange={handleChanges} /><br />
        </div>

        <div className='form-row'> 
        <label for="email">Email </label>
        <input  type="email" name="email" id="email" value={changedData.email} onChange={handleChanges} /><br />
        </div>

        <div className='form-row'> 
        <label for="role">Role </label>
        <input  type="text" className='pointerevent' name="role" id="role" defaultValue={changedData.role} readonly />
        </div>

        </div>
        <br></br>
        <div className='both'>
        
        <div className='form-row'>  
        <label>Last Name </label>
        <input type="text" name="secondname" id="secondname" value={changedData.secondname} onChange={handleChanges} /><br />
        </div>

        <div className='form-row'> 
        <label className=''>Phone</label>
        <input  type="text" name="phone" id="phone" value={changedData.phone} onChange={handleChanges} /><br />
        </div>

        <div className='form-row'> 
        <label>Language  </label>
        <input  type="text"  name='language' id='language' value={changedData.language} onChange={handleChanges} /><br></br>

        </div></div>
        </div>
      <div className='fullbutton'>
      <button type="button" className="button" onClick={handleSubmit}>Update</button>
      <button type="button" className="button1" onClick={handleCancel}>Cancel</button>
    </div>
    </div>
    </div>
  );
}



export default ProfileUpdate;
