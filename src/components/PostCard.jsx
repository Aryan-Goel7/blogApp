import React, { useEffect, useState } from 'react';
import appwriteService from '../appwrite/config';
import { Link } from 'react-router-dom';

function PostCard({ $id, title, featuredImage, author }) {
    return (
        <Link to={`/post/${$id}`}>
            <div className='w-full bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden'>
                <div className='relative w-full h-48'>
                    <img
                        src={appwriteService.getFilePreview(featuredImage)}
                        alt={title}
                        className='w-full h-full object-cover object-center'
                    />
                </div>
                <div className='p-4'>
                    <h2 className='text-lg font-semibold mb-2'>{title}</h2>
                    <p className='text-gray-600 text-sm'>By: {author}</p>
                </div>
            </div>
        </Link>
    );
}
export default PostCard;