import React from 'react'
import Post from './Post'
import { useSelector } from 'react-redux'
import store from '../redux/store.js'

const Posts = () => {
  const {posts} = useSelector(store => store.post);
  return (
    <div className='flex flex-col items center '>{
      posts.map((post)=> <Post key={post._id} post={post}/>)
    }
    </div>
  )
}

export default Posts
