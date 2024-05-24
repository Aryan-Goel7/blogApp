import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import authService from '../appwrite/auth';
import { login } from '../store/authSlice';
import { Input, Button, Logo } from '../components';

function SignUp() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const history = useNavigate();
    const dispatch = useDispatch();
    const { register, handleSubmit, formState: { errors } } = useForm();

    const signUp = async (data) => {
        setError('');
        setLoading(true);
        try {
            const userData = await authService.signUp(data);
            if (userData) {
                dispatch(login(userData));
                history('/');
            }
        } catch (error) {
            setError(error.message);
            console.error('An Error Occurred in Sign Up:', error.message);
        } finally {
            setLoading(false);
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="flex items-center justify-center">
            <div className="mx-auto w-full max-w-lg bg-gray-100 rounded-xl p-10 border border-black/10">
                <div className="mb-2 flex justify-center">
                    <span className="inline-block w-full max-w-[100px]">
                        <Logo width="100%" />
                    </span>
                </div>
                <h2 className="text-center text-2xl font-bold leading-tight">Sign up to create an account</h2>
                <p className="mt-2 text-center text-base text-black/60">
                    Already have an account?&nbsp;
                    <Link
                        to="/login"
                        className="font-medium text-primary transition-all duration-200 hover:underline"
                    >
                        Sign In
                    </Link>
                </p>
                {error && <p className="text-red-600 mt-4 text-center">{error}</p>}

                <form onSubmit={handleSubmit(signUp)}>
                    <div className="space-y-5">
                        <Input
                            label="Full Name:"
                            placeholder="Enter your full name"
                            {...register('name', { required: true })}
                        />
                        {errors.name && <p className="text-red-600 text-sm">Please enter your full name</p>}
                        <Input
                            label="Email:"
                            placeholder="Enter your email"
                            type="email"
                            {...register('email', { required: true, pattern: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/ })}
                        />
                        {errors.email && <p className="text-red-600 text-sm">Please enter a valid email address</p>}
                        <Input
                            label="Password:"
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Enter your password"
                            {...register('password', { required: true })}
                        />
                        {errors.password && <p className="text-red-600 text-sm">Please enter a password</p>}
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="showPassword"
                                className="mr-2"
                                checked={showPassword}
                                onChange={togglePasswordVisibility}
                            />
                            <label htmlFor="showPassword">Show Password</label>
                        </div>
                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? 'Creating Account...' : 'Create Account'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default SignUp;
