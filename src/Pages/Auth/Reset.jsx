import React, { useState } from 'react';
import './Auth.css';
import { toast } from "react-toastify";
import resetImg from '../../assets/reset.png';
import { Link } from 'react-router-dom';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from "../../Utilities/Configure";

const Reset = () => {
    
    const[email, setEmail] = useState("");
    const[buttonDisabled, setButtonDisabled] = useState(false);


  const handleSubmit = (e) => {
    e.preventDefault();
    setButtonDisabled(true)
    sendPasswordResetEmail(auth, email)
  .then(() => {
    toast.success('go to your email for reset link')
  })
  .catch((error) => {
    toast.error(error.message)
  })
    .finally(() => {
      setButtonDisabled(false)
    })
    setEmail('')
  }
    
  

    return (
    <section className='register-container'>
    <img src={resetImg} className='register-img'/>
    <div className='form-container'>
     <h3 className='register-text'>Reset Password</h3>
    <form onSubmit={handleSubmit} className='input-form'>
   
    <div className='password-input-container'>
                        <input
                            required
                            placeholder='Enter Email'
                            type='text'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
   <button type='submit' disabled={buttonDisabled}>submit</button>
    </form>
   <Link to='/login' className='register-opacity'>Login</Link>
   <Link to='/register' className='register-opacity'>Register</Link>
  </div>
  </section>
  )
}

export default Reset;