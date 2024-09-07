"use client"

import { useState } from "react";

export function useToggle(initialValue = false) {
  const [ toogle, setToggl ] = useState(initialValue);
  return [ value, setValue(!value) ]
}