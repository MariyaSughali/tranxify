import './App.css';
import { useState, useEffect} from 'react';
import axios from 'axios';
import React from 'react';
import { useNavigate } from 'react-router-dom';

function Passwordupdate(){
  const navigate = useNavigate();
  const handleClickPassword = () => {
    navigate('/password');
  };
  const handleClickaccount = () => {
    navigate('/');
  };
  const[passwords,setPasswords]=useState({
    oldPassword:'',
    newPassword:'',
    confirmPassword: '', 
  })

  const handlePasswordUpdate = async () => {
    // Check if newPassword and confirmPassword match
    if (passwords.newPassword !== passwords.confirmPassword) {
      alert("New password and confirmation password don't match");
      return;
    }

    try {
      // Send a PUT request to update the password
      await axios.put('http://localhost:3008/changepassword', {
        oldPassword:passwords.oldPassword,
        newPassword: passwords.newPassword, 
      });
      alert('Password updated successfully');
      setPasswords({ oldPassword:'',
      newPassword:'',
      confirmPassword: '', })

    } catch (error) {
      console.error('Error updating password:', error);
      alert('Invalid old password');
    }
  };

  const handlecancel= async()=>{
    try{
      setPasswords({ oldPassword:'',
      newPassword:'',
      confirmPassword: '', })
    }catch{
      console.log("not cancelled")
    }
    
  }

  // aws upload
  const [ischanged, setischanged] = useState(false);
  const [selectedFile, setSelectedFile] = useState();
  const [changedData, setChangedData] = useState({
    image: '',
  });

  useEffect(() => {
    axios.get('http://localhost:3008/')
      .then((response) => {
        if (response.data && response.data.length > 0) {
          const userData = response.data[0];
          setChangedData({
            image: userData.image,
          });
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }, [ischanged]);

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
  alert('Image uploaded to successfully');
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
        <button onClick={handleClickaccount}>ACCOUNT</button><br></br>
        <button onClick={handleClickPassword}>PASSWORD</button><br></br>
        <button>SETTINGS</button><br></br>
        <button>LOG OUT</button><br></br>

    </div>
    <div className='secondhalf'>
        <h2 className='movedown'>PASSWORD</h2>
        <br></br>
        <div className='divide '>
        <div className='both'>   

        <div className='form-row'>        
        <label htmlfor="oldpassword">Old Password </label>
        <input  type="text" name="oldpassword" id="oldpassword" value={passwords.oldPassword}
                onChange={(e) =>setPasswords({ ...passwords, oldPassword: e.target.value }) }/><br />
        </div>

        <div className='form-row'> 
        <label htmlfor="newpassword">New Password</label>
        <input  type="text" name="newpassword" id="newpassword"  value={passwords.newPassword}
                onChange={(e) =>setPasswords({ ...passwords, newPassword: e.target.value })} /><br />
        </div>

        </div>
        <br></br>
        <div className='both'>
        <div className='margin'>
        <div className='form-row'> 
        <label htmlfor="confirmpassword">Confirm Password </label>
        <input  type="text" name='confirmpassword' id='confirmpassword' value={passwords.confirmPassword}
                  onChange={(e) => setPasswords({...passwords,confirmPassword: e.target.value,})}/><br></br>
        </div>
        </div>
       </div>
      </div>
      <div className='fullbutton'>
      <button type="button" className="button" onClick={handlePasswordUpdate} >Update</button>
      <button type="button" className="button1" onClick={handlecancel} >Cancel</button>
    </div>
    </div>
    </div>
  );
}

export default Passwordupdate;