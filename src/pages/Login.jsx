import React, { useState, useRef } from 'react'

const Login = () => {
  const [state, setState] = useState('Sign Up')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [errorMessage, setErrorMessage] = useState({
    nameError: '',
    emailError: '',
    passwordError: ''
  })

  // Refs for input fields
  const nameRef = useRef(null);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const submitRef = useRef(null);

  // Validate Name
  const validateName = (name) => {
    return name.trim().length >= 3; // Name must be at least 3 characters long
  }

  // Validate Email
  const validateEmail = (email) => {
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return emailPattern.test(email);
  }

  // Validate Password
  const validatePassword = (password) => {
    const passwordCriteria = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordCriteria.test(password);
  }

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    let isValid = true;
    const newErrors = { nameError: '', emailError: '', passwordError: '' };

    if (state === 'Sign Up' && !validateName(name)) {
      newErrors.nameError = 'Name should be at least 3 characters.';
      isValid = false;
    }

    if (!validateEmail(email)) {
      newErrors.emailError = 'Invalid email format.';
      isValid = false;
    }

    if (!validatePassword(password)) {
      newErrors.passwordError = 'Password must be at least 8 chars, include uppercase, number, and special char.';
      isValid = false;
    }

    setErrorMessage(newErrors);

    if (isValid) {
      setErrorMessage({ nameError: '', emailError: '', passwordError: '' });
      console.log("Form Submitted", { email, password, name });
    }
  }

  // Handle Enter, Up, and Down Arrow Key Navigation for input fields only (excluding button)
  const handleKeyDown = (e, nextRef, prevRef) => {
    if (e.key === 'Enter' || e.key === 'ArrowDown') {
      e.preventDefault();
      if (nextRef && nextRef.current) {
        nextRef.current.focus();
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (prevRef && prevRef.current) {
        prevRef.current.focus();
      }
    }
  }

  return (
    <form className="min-h-[80vh] flex items-center" onSubmit={onSubmitHandler}>
      <div className='flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-zinc-600 text-sm shadow-lg'>
        <p className='text-2xl font-semibold'>{state === 'Sign Up' ? "Create Account" : "Login"}</p>
        <p>Please {state === 'Sign Up' ? "sign up" : "Login"} to book an appointment</p>

        {
          state === "Sign Up" && (
            <div className='w-full'>
              <p>Full Name</p>
              <input 
                ref={nameRef} // Reference for the full name field
                className='border border-zinc-300 rounded w-full p-2 mt-1' 
                type="text" 
                onChange={(e) => setName(e.target.value)} 
                value={name} 
                onKeyDown={(e) => handleKeyDown(e, emailRef, null)} // Next: email, no previous
                required 
              />
              {errorMessage.nameError && <p className='text-red-500 text-xs'>{errorMessage.nameError}</p>}
            </div>
          )
        }

        <div className='w-full'>
          <p>Email</p>
          <input 
            ref={emailRef} // Reference for the email field
            className='border border-zinc-300 rounded w-full p-2 mt-1' 
            type="email" 
            onChange={(e) => setEmail(e.target.value)} 
            value={email} 
            onKeyDown={(e) => handleKeyDown(e, passwordRef, nameRef)} // Next: password, Previous: name
            required 
          />
          {errorMessage.emailError && <p className='text-red-500 text-xs'>{errorMessage.emailError}</p>}
        </div>

        <div className='w-full'>
          <p>Password</p>
          <input 
            ref={passwordRef} // Reference for the password field
            className='border border-zinc-300 rounded w-full p-2 mt-1' 
            type="password" 
            onChange={(e) => setPassword(e.target.value)} 
            value={password} 
            onKeyDown={(e) => handleKeyDown(e, null, emailRef)} // Next: none, Previous: email
            required 
          />
          {errorMessage.passwordError && <p className='text-red-500 text-xs'>{errorMessage.passwordError}</p>}
        </div>

        <button 
          ref={submitRef} // Reference for the submit button
          className='bg-primary text-white w-full py-2 rounded-md text-based focus:outline-none' // Remove outline
          type="submit"
        >
          {state === 'Sign Up' ? "Create Account" : "Login"}
        </button>

        {state === "Sign Up"
          ? <p>Already have an account? <span onClick={() => setState('Login')} className='text-primary underline cursor-pointer'>Login here</span> </p>
          : <p>Create a new account? <span onClick={() => setState('Sign Up')} className='text-primary underline cursor-pointer'>Click here</span> </p>
        }
      </div>
    </form>
  )
}

export default Login
