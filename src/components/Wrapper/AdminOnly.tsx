import React, { useEffect, useState } from "react";
import { serviceContainer } from "~modules/service.module";
import { AUTH_SERVICE, type AuthService } from "~modules/services/auth.service";

interface AdminOnlyProps {
  children: React.ReactNode;
}

const AdminOnly: React.FC<AdminOnlyProps> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const authService = serviceContainer.get<AuthService>(AUTH_SERVICE);

  useEffect(() => {
    const checkAuth = async () => {
      const isAuth = await authService.verifyAuth();
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
