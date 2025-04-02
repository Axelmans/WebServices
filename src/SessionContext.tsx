import React, { createContext, useContext, useState } from "react";


/*
* For user convenience, the local storage should keep track of the login status and the session ID, this allows:
* -The user to stay logged in after returning to the site at a later time.
* -The user not to lose their login when manually going to another page.
* Important: favourites can be fetched with the session id, so these do not need to be stored.
*/
export interface LoginState {
  loggedIn: boolean;
  sessionID: string | null;
  favourites: number[];
  update: (newState: Partial<LoginState>) => void;
}

// By default, user is not logged in and no session id is generated
const DefaultState: LoginState = {
  loggedIn: false,
  sessionID: null,
  favourites: [],
  update: (newState?: Partial<LoginState>) => {}
}

// The context starts with the default state
const SessionContext = createContext<LoginState | undefined>(DefaultState);

export const SessionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // The local storage should be checked upon startup, and updated after certain actions
  const [loggedIn, setLoggedIn] = useState(() => {
    // The boolean that states if the user is logged in will be stored as a string
    const stored = localStorage.getItem("loggedIn");
    return stored === "true";
  });
  const [sessionID, setSessionID] = useState<string | null>(() => {
    return localStorage.getItem("sessionID");
  });
  const [favourites, setFavourites] = useState<number[]>(() => {
    const stored = localStorage.getItem("favourites");
    try {
      return stored ? JSON.parse(stored) : [];
    }
    catch {
      return [];
    }
  })
  const update = (newState: Partial<LoginState>) => {
    if(newState.loggedIn !== undefined){
      setLoggedIn(newState.loggedIn);
      localStorage.setItem("loggedIn", newState.loggedIn.toString());
    }
    if(newState.sessionID !== undefined) {
      setSessionID(newState.sessionID);
      if (newState.sessionID) {
        localStorage.setItem("sessionID", newState.sessionID);
      } else {
        localStorage.removeItem("sessionID");
      }
    }
    if(newState.favourites !== undefined){
      setFavourites(newState.favourites)
      localStorage.setItem("favourites", JSON.stringify(newState.favourites));
    }
  };
  return (
    <SessionContext.Provider value={{loggedIn, sessionID, favourites, update}}>
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