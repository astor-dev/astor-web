import React, { useEffect, useState } from "react";
import { AuthService } from "~services/auth.service";

interface AdminOnlyProps {
  children: React.ReactNode;
}

const AdminOnly: React.FC<AdminOnlyProps> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const isAuth = await AuthService.verifyAuth();
      setIsAuthenticated(isAuth);
      setIsLoading(false);

      if (!isAuth) {
        window.location.href = "/";
      }
    };

    checkAuth();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>; // 또는 로딩 스피너 컴포넌트
  }

  return isAuthenticated ? <>{children}</> : null;
};

export default AdminOnly;
