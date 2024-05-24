import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import authService from '../appwrite/auth';
import { login as authLogin } from '../store/authSlice';
import { Button, Input, Logo } from './index';

function Login() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const login = async (data) => {
        setError('');
        setLoading(true);
        try {
            const session = await authService.logIn(data);
            if (session) {
                const userData = await authService.getCurrentUser();
                if (userData) dispatch(authLogin(userData));
                navigate('/');
            }
        } catch (error) {
            setError(error.message);
            console.error('An Error Occurred in Login:', error.message);
        } finally {
            setLoading(false);
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className='flex items-center justify-center w-full'>
            <div className='mx-auto w-full max-w-lg bg-gray-100 rounded-xl p-10 border border-black/10'>
                <div className='mb-2 flex justify-center'>
                    <span className='inline-block w-full max-w-[100px]'>
                        <Logo width='100%' />
                    </span>
                </div>
                <h2 className='text-center text-2xl font-bold leading-tight'>Sign in to your account</h2>
                <p className='mt-2 text-center text-base text-black/60'>
                    Don&apos;t have any account?&nbsp;
                    <Link
                        to='/signup'
                        className='font-medium text-primary transition-all duration-200 hover:underline'
                    >
                        Sign Up
                    </Link>
                </p>
                {error && <p className='text-red-600 mt-8 text-center'>{error}</p>}
                <form onSubmit={handleSubmit(login)} className='mt-8'>
                    <div className='space-y-5'>
                        <Input
                            label='Email:'
                            placeholder='Enter your email'
                            type='email'
                            {...register('email', { required: 'Email is required', pattern: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/ })}
                        />
                        {errors.email && <p className='text-red-600 text-sm'>{errors.email.message}</p>}
                        <Input
                            label='Password:'
                            type={showPassword ? 'text' : 'password'}
                            placeholder='Enter your password'
                            {...register('password', { required: 'Password is required' })}
                        />
                        {errors.password && <p className='text-red-600 text-sm'>{errors.password.message}</p>}
                        <div className='flex items-center'>
                            <input
                                type='checkbox'
                                id='showPassword'
                                className='mr-2'
                                checked={showPassword}
                                onChange={togglePasswordVisibility}
                            />
                            <label htmlFor='showPassword'>Show Password</label>
                        </div>
                        <Button type='submit' className='w-full' disabled={loading}>
                            {loading ? 'Signing in...' : 'Sign in'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Login;
