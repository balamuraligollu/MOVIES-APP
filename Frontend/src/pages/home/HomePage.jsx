import { useAuthStore } from "../../store/authUser";
import AuthScreen from "./AuthScreen";
import HomeScreen from "./HomeScreen";

export default function HomePage() {
    const { user } = useAuthStore();
    return (
        <div>
            {user ? <HomeScreen /> : <AuthScreen />}
        </div>
    );
}
