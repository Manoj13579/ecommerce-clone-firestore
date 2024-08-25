import React, { useEffect, useRef, useState } from 'react';
import './Auth.css';
import { database } from '../../Utilities/Configure';
import { FaGoogle } from "react-icons/fa";
import loginImg from '../../assets/login.png';
import eyeoImg from '../../assets/eye-open.png';
import eyecImg from '../../assets/eye-close.png';
import { Link, useNavigate} from 'react-router-dom';
import { toast } from "react-toastify";
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from '../../Utilities/Configure';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { useDispatch } from 'react-redux';
import { SET_ADD_USER_INFO } from '../../Store/loginSlice';



const Login = () => {
    
    const[email, setEmail] = useState("");
    const[password, setPassword] = useState("");
    const[buttonDisabled, setButtonDisabled] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

  
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const inputRef = useRef();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setButtonDisabled(true);
    try {
      const users = await signInWithEmailAndPassword(auth, email, password);
      try {
        const q = query(
          collection(database, 'user'),
          where('uid', '==', users?.user?.uid )
        );
        const data = onSnapshot(q, (QuerySnapshot) => {
          let user;
          QuerySnapshot.forEach((doc) => user = doc.data());
          dispatch(SET_ADD_USER_INFO(user));
        setEmail('')
        setPassword('')
        toast.success('login sucessfully')
        setButtonDisabled(true)
        if(user.role === 'user') {
        navigate('/cart')
      }
      else {
        navigate('/adminlayout')
      }
        });
        return () => data;
      } catch (error) {
        toast.error(error.message);
      }
    } catch (error) {
      toast.error(error.message);
      setButtonDisabled(false);
    }
  };
  
   
  const togglePasswordVisibility = () => {
    if(password === ""){
      toast.warn(`password can't be empty`)
    }
    else{
    setShowPassword(!showPassword);
    }};
  
    // google login auth
  const provider = new GoogleAuthProvider();
  const handleGoogleClick = () => {
    signInWithPopup(auth, provider)
    .then((result) => {
      const user = result.user;
      toast.success('logged in successfully')
      navigate('/cart');
    })
    .catch((error) => {
      toast.error(error.message)
    })
  }


    return (
    <section className='register-container'>
    <img src={loginImg} className='register-img'/>
    <div className='form-container'>
     <h3 className='register-text'>Login</h3>
    <form onSubmit={handleSubmit} className='input-form'>
    
    <input
    required
    ref={inputRef}
    autoFocus
    placeholder='Enter email'
    type='email'
    value={email}
    onChange={(e) => setEmail(e.target.value)}
    />
    <div className='password-input-container'>
                        <input
                            required
                            placeholder='Enter Password'
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                            <img onClick={togglePasswordVisibility}src={showPassword ? eyeoImg : eyecImg} alt='Toggle Password Visibility'
                            className='toggle-password' />
                    </div>
    <button type='submit' disabled={buttonDisabled}>submit</button>
    </form>
    <Link to='/reset'className='register-opacity'>Reset Password</Link>
    <p className='register-opacity'>- - or - -</p>
    <button onClick={handleGoogleClick} className='login-bttn'><FaGoogle /> Log in with Google</button>
    <p><span className='register-opacity'>Don't have an Account ? </span><Link to='/register'>Register</Link></p>
  </div>
  </section>
  )
}

export default Login;