import React from 'react'

export interface User {
  id: string;
  username: string;
  fullname: string;
  dateOfBirth: Date;
  email?: string;
}

export interface UserContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  isLoggedIn: boolean;  // Changed from isLogged to match implementation
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
}

const UserContext = React.createContext<UserContextType | null>(null);

export default UserContext;