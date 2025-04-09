import React, { createContext, useContext, useState } from "react";


/*
* For user convenience, the local storage should keep track of the login status and the session ID, this allows:
* -The user to stay logged in after returning to the site at a later time.
* -The user not to lose their login when manually going to another page.
* Important: favourites can be fetched with the session id, so these do not need to be stored.
*/
export interface FavouritesState {
  favourites: number[];
  setFavourites: (newFavourites: number[]) => void;
}

// The context starts with the default state
const SessionContext = createContext<FavouritesState | undefined>(undefined);

export const SessionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // The local storage should be checked upon startup, and updated after certain actions
  const [favourites, setFavourites] = useState<number[]>(() => {
    const stored = localStorage.getItem("favourites");
    try {
      return stored ? JSON.parse(stored) : [];
    }
    catch {
      return [];
    }
  })
  return (
    <SessionContext.Provider value={{favourites, setFavourites}}>
      {children}
    </SessionContext.Provider>
  );
};

// This function allows other components to call this context
export const useSession = () => {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error("useSession must be used within a SessionProvider");
  }
  return context;
};