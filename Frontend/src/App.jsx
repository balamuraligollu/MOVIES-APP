import { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom"; 
import HomePage from "./pages/home/HomePage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import WatchPage from "./pages/WatchPage";
import SearchPage from "./pages/SearchPage";
import SearchHistoryPage from "./pages/SearchHistoryPage";
import NotFoundPage from "./pages/NotFoundPage";
import PaymentPage from "./pages/PaymentPage";
import Footer from "./components/Footer";
import { Toaster } from "react-hot-toast";
import { useAuthStore } from "./store/authUser";
import { Loader } from "lucide-react";
import ProtectedRoute from "./components/ProtectedRoute"; // Import the wrapper
import Success from "./pages/Success";
import Cancel from "./pages/Cancel";
import UploadPage from "./pages/uploadPage";
import AuthorizeUser from "./components/AuthorizeUser";
import UploadEdit from "./pages/UploadEdit";

export default function App() {
    const { user, isCheckingAuth, authCheck } = useAuthStore();

    useEffect(() => {
        authCheck(); 
    }, [authCheck]);

    if (isCheckingAuth) {
        return (
            <div className="h-screen flex justify-center items-center bg-black">
                <Loader className="animate-spin text-red-600 w-10 h-10" />
            </div>
        ); 
    }

    return (
        <div>
            <Routes>
                {/* Public Routes */}
                <Route path="/" element={<HomePage />} />
                <Route path="/signup" element={!user ? <SignUpPage /> : <Navigate to="/login" />} />
                <Route path="/login" element={!user ? <LoginPage /> : <Navigate to="/" />} />
                

                {/* Protected Routes */}
                <Route path="/watch/:id" element={<ProtectedRoute><WatchPage /></ProtectedRoute>} />
                <Route path="/search" element={<ProtectedRoute><SearchPage /></ProtectedRoute>} />
                <Route path="/history" element={<ProtectedRoute><SearchHistoryPage /></ProtectedRoute>} />
                <Route path="/payment/:contentId" element={<PaymentPage />} />
                <Route path='/success' element={<Success/>}/>
                <Route path='/cancel' element={<Cancel/>}/>

                <Route path="/upload" element={
                    <ProtectedRoute>
                       <AuthorizeUser roles={['admin']}>
                          <UploadPage />
                       </AuthorizeUser>
                    </ProtectedRoute>
                } />
                <Route path="/upload/:id" element={
                    <ProtectedRoute>
                      <AuthorizeUser roles={['admin']}>
                         <UploadEdit />
                      </AuthorizeUser>
                    </ProtectedRoute>
                } />

                {/* Catch-all for 404 */}
                <Route path="/*" element={<NotFoundPage />} />
            </Routes>
            <Footer />
            <Toaster />
        </div>
    );
}
