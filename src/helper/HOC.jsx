import { useEffect } from "react";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";

const requireAuth = (WrappedComponent) => {
  const HOC = (props) => {
    const navigate = useNavigate();
    const [cookies] = useCookies();

    useEffect(() => {
      // Check if authentication state is available and not already authenticated
      if (!cookies.token) {
        navigate("/login"); // Redirect to login page if no authentication data
      }
    }, [cookies.token]);

    if (!cookies.token) {
      return null; // Show loading or handle redirect above
    }

    return <WrappedComponent {...props} />;
  };

  return HOC;
};

export default requireAuth;
