"use client"

import React, { useState, createContext, useContext } from "react";

interface SearchContextType {
  searchValue: string,
  setSearchValue: React.Dispatch<React.SetStateAction<string>>;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

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

  const context = useContext(SearchContext);
  if(context === undefined) throw new Error("useSearch must be used within a SearchContextProvider");

  return context;
}