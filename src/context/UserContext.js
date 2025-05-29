import React, { createContext, useContext, useState } from "react";
import UserService from "../api/userService";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Solo el usuario autenticado

  const login = async (email) => {
    try {
      const response = await UserService.getAll();
      const allUsers = response.data;

      const foundUser = allUsers.find((u) => u.email === email);

      if (foundUser) {
        setUser(foundUser);
      } else {
        throw new Error("Usuario no encontrado.");
      }
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      throw error;
    }
  };

  const register = async (userInfo) => {
    try {
      const response = await UserService.addUser(userInfo);
      setUser(response.data); // Guarda directamente el nuevo usuario
    } catch (error) {
      console.error("Error al registrar usuario:", error);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, setUser, login, register, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
