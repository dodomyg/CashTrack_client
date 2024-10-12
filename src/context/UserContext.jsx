import { createContext, useEffect, useState } from "react";

export const UserContext = createContext({});

// eslint-disable-next-line react/prop-types
const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  console.log("from context", user);
  useEffect(() => {
    const checkUser = async () => {
      const user = localStorage.getItem("user");
      if (user) {
        setUser(JSON.parse(user));
      }
      setLoading(false);
    };
    checkUser();
  }, []);
  return (
    <UserContext.Provider value={{ user, setUser, loading, setLoading }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
