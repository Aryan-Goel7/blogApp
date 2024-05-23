import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { Provider } from "react-redux";
import store from "./store/store.js";
import { Home, AddPost, EditPost, AllPosts, Login, SignUp, Post } from "./pages/index.js";
import { AuthLayout } from "../src/components"

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
ReactDOM.createRoot(document.getElementById('root')).render(
  // <React.StrictMode>
  <Provider store={store}>
    <Router>
      <Routes>
        <Route path="/" element={<App />}>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<AuthLayout authentication={false}><Login /></AuthLayout>} />
          <Route path="/signup" element={<AuthLayout authentication={false}><SignUp /></AuthLayout>} />
          <Route path="/all-posts" element={<AuthLayout authentication><AllPosts /></AuthLayout>} />
          <Route path="/add-post" element={<AuthLayout authentication><AddPost /></AuthLayout>} />
          <Route path="/edit-post/:slug" element={<AuthLayout authentication><EditPost /></AuthLayout>} />
          <Route path="/post/:slug" element={<Post />} />
        </Route>
      </Routes>
    </Router>
  </Provider>
  // </React.StrictMode>
)
