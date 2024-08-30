"use client"

import { useState, createContext, useContext } from "react";

const SearchContext = createContext({});

export function SearchContextProvider({ children } : { children: React.ReactNode }) {
  //TODO: Update to support tag searching as well.
  const [ searchValue, setSearchValue ] = useState(""); 

  return(
    <SearchContext.Provider value={{ searchValue, setSearchValue }}>
      { children }
    </SearchContext.Provider>
  )
}

export function useSearch() {
  return useContext(SearchContext);
}