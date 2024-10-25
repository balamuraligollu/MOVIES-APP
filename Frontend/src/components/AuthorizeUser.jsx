import { useAuthStore } from '../store/authUser';
import { Navigate } from 'react-router-dom';

const AuthorizeUser = ({ roles, children }) => {
    const { user } = useAuthStore();

    // Check if user and roles are defined
    if (!user || !roles) {
        return <Navigate to="/*" />;
    }

    // Ensure user.role is defined and is an array or string
    const userRole = user.role;
    if (Array.isArray(roles) && roles.includes(userRole)) {
        return children;
    }

    return <Navigate to="/*" />;
};

export default AuthorizeUser;