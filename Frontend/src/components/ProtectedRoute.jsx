import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/authUser";

export default function ProtectedRoute({ children }) {
    const { user } = useAuthStore();

    return user ? children : <Navigate to="/login" />;
}
