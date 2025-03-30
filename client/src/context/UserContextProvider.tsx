import React from "react";
import UserContext, { User } from "./UserContext.js";

const UserContextProvider = ({children}: { children: React.ReactNode }) => {
    const [user, setUser] = React.useState<User | null>(null);
    const [isLoggedIn, setIsLoggedIn] = React.useState(false);
    
    return(
        <UserContext.Provider value={{
            user, 
            setUser, 
            isLoggedIn, 
            setIsLoggedIn
        }}>
            {children}
        </UserContext.Provider>
    )
}

export default UserContextProvider;