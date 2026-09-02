import { useState,useEffect } from 'react'
import './App.css'
import { setUser, setCheckingAuth } from "@/store/authSlice";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/authContext";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import ChatAppUI from './pages/ChatAppUI';
import ProtectedRoute from '../routes/ProtectedRoute';
import NexoraLandingPage from './pages/NexoraLandingPage';



function App() {

return (
  
  
  

 <AuthProvider>
    <BrowserRouter>
       <Routes>
        <Route path="/" element={<NexoraLandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<SignUpPage />} />
         <Route path="/chatui" element={<ChatAppUI />} />
        

        <Route
          path="/chatui"
          element={
            <ProtectedRoute>
              <ChatAppUI />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
   </AuthProvider>

)}
  
 
export default App
