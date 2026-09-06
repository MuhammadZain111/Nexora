import { BrowserRouter, Route, Routes } from "react-router-dom";
import ProtectedRoute from '../routes/ProtectedRoute';
import './App.css';
import { AuthProvider } from "./context/AuthContext";
import ChatAppUI from './pages/ChatAppUI';
import LoginPage from "./pages/LoginPage";
import NexoraLandingPage from './pages/NexoraLandingPage';
import SignUpPage from "./pages/SignUpPage";



function App() {


  
return ( 
  

<BrowserRouter>
 <AuthProvider>
    
       <Routes>
        <Route path="/" element={<NexoraLandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<SignUpPage />} />
        <Route
          path="/chatui"
          element={
            <ProtectedRoute>
              <ChatAppUI />
            </ProtectedRoute>
          }
        />
      </Routes>
   
   </AuthProvider>
    </BrowserRouter>

)}
  
 
export default App
