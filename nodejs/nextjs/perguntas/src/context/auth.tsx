import React, { useEffect } from "react";
import { currentUser } from "../firebase";

export const AuthContext = React.createContext({
  displayName: "",
  checkAuth: false,
  connected: () => {},
  disconnected: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [auth, setAuth] = React.useState(false);
  const [displayName, setDisplayName] = React.useState<string>("");

  useEffect(() => {
    currentUser((user) => {
      if (user) {
        login();
        setDisplayName(user.displayName || "")
      } else {
        logout();
        setDisplayName("")
      }
    });
  }, []);

  const login = () => {
    setAuth(true);
  };
  const logout = () => {
    setAuth(false);
  };

  return (
    <>
      <AuthContext.Provider
        value={{
          displayName: displayName,
          checkAuth: auth,
          connected: login,
          disconnected: logout,
        }}
      >
        {children}
      </AuthContext.Provider>
    </>
  );
};
