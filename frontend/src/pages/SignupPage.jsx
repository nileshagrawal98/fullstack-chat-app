import React, { useState } from 'react'
import { useAuthStore } from '../store/useAuthStore';
import { Eye, EyeOff, Loader2, Lock, Mail, MessageSquare, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import AuthImagePattern from '../components/AuthImagePattern';
import toast from 'react-hot-toast';

const SignupPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });
  const { signup, isSigningUp } = useAuthStore();

  const validateForm = () => {
    if (!formData.fullName.trim()) return toast.error("Full name is mandatory");
    if (!formData.email.trim()) return toast.error("Email is mandatory");
    if (!/\S+@\S+\.\S+/.test(formData.email)) return toast.error("Invalid email provided");
    if (!formData.password.trim()) return toast.error("Password is mandatory");
    if (formData.password.trim().length < 6) return toast.error("Password must have at least 6 characters");

    return true;
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    const isValid = validateForm() === true;
    if (isValid) {
      signup(formData);
    }
  };

  return (
    <div className='min-h-screen grid lg:grid-cols-2'>
      {/* Left side */}
      <div className='flex flex-col justify-center items-center p-6 sm:p-12'>
        <div className='w-full max-w-md space-y-8'>
          {/* LOGO */}
          <div className='text-center mb-8' >
            <div className='flex flex-col items-center gap-2 group' >
              <div className='size-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors' >
                <MessageSquare className='size-6 text-primary' />
              </div>
              <h1 className='text-2xl font-bold mt-2' >Join Us</h1>
              <p className='text-base-content/60' >You&apos;re just a step away from getting started</p>
            </div>
          </div>

          {/* FORM */}
          <form onSubmit={handleSubmit} className='space-y-6'>
            {/* Full Name */}
            <div className='form-control' >
              <label className='label'>
                <span className='label-text font-medium'>Full Name</span>
              </label>
              <div className='relative' >
                <div className='absolute z-2 inset-y-0 left-0 pl-3 flex items-center pointer-events-none' >
                  <User className='size-5 text-base-content/40' />
                </div>
                <input
                  type="text"
                  className='input input-bordered w-full pl-10'
                  placeholder='Nilesh Agrawal'
                  value={formData.fullName}
                  onChange={
                    (e) => setFormData((prev) => ({ ...prev, fullName: e.target.value }))
                  }
                />
              </div>
            </div>

            {/* Mail */}
            <div className='form-control' >
              <label className='label'>
                <span className='label-text font-medium'>Email</span>
              </label>
              <div className='relative' >
                <div className='absolute z-2 inset-y-0 left-0 pl-3 flex items-center pointer-events-none' >
                  <Mail className='size-5 text-base-content/40' />
                </div>
                <input
                  type="email"
                  className='input input-bordered w-full pl-10'
                  placeholder='youremail@gmail.com'
                  value={formData.email}
                  onChange={
                    (e) => setFormData((prev) => ({ ...prev, email: e.target.value }))
                  }
                />
              </div>
            </div>

            {/* Password */}
            <div className='form-control' >
              <label className='label'>
                <span className='label-text font-medium'>Password</span>
              </label>
              <div className='relative' >
                <div className='absolute z-2 inset-y-0 left-0 pl-3 flex items-center pointer-events-none' >
                  <Lock className='size-5 text-base-content/40' />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  className='input input-bordered w-full pl-10'
                  placeholder='••••••••'
                  value={formData.password}
                  onChange={
                    (e) => setFormData((prev) => ({ ...prev, password: e.target.value }))
                  }
                />
                <button
                  type='button'
                  className='absolute z-2 inset-y-0 right-0 pr-3 flex items-center'
                  onClick={() => setShowPassword((prev) => !prev)}>
                  {
                    showPassword ? <EyeOff className='size-5 text-base-content/40' /> : <Eye className='size-5 text-base-content/40' />
                  }
                </button>
              </div>
            </div>

            {/* Create account button */}
            <button type='submit' className='btn btn-primary w-full' disabled={isSigningUp} >
              {
                isSigningUp ? (
                  <>
                    <Loader2 className='size-5 animate-spin' />
                    Signing Up...
                  </>
                ) : (
                  "Create Account"
                )
              }
            </button>

            {/* Existing user */}
            <div className='text-center'>
              <p className='text-base-content/60' >
                Existing user?{" "}
                <Link to="/login" className='link link-primary'>
                  Login
                </Link>
              </p>
            </div>

          </form>
        </div>

      </div>

      {/* Right Side */}
      <AuthImagePattern
        title="Be part of something great"
        subtitle="Where ideas, support, and people come together" />
    </div>
  )
}

export default SignupPage;
