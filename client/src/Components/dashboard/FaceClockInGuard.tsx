import { useLocation, Navigate } from "react-router-dom";

function FaceClockInGuard({ children }: { children: React.ReactNode }) {
    const location = useLocation();
    const sudoUser = location.state?.sudoUser;

    if (!sudoUser) {
        return <Navigate to="/login" replace />;
    }

    return children;
}

export default FaceClockInGuard;
