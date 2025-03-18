import React, { createContext, useState } from 'react'
export const addResponceContext = createContext()
export const editResponceContext = createContext()
export const tableaddResponceContext = createContext()
export const tableEditResponceContext = createContext()

const ContextShare = ({children}) => {
  const[addResponce, setAddResponce] = useState("")
  const[editResponce,setEditResponce] = useState("")
  const[tableaddResponce, setTableAddResponce] = useState("")
  const[tableEditResponce,setTableEditResponce] = useState("")
  return (
    <addResponceContext.Provider value={{addResponce, setAddResponce}}>
      <editResponceContext.Provider value={{editResponce,setEditResponce}}>
        <tableaddResponceContext.Provider value={{tableaddResponce, setTableAddResponce}}>
          <tableEditResponceContext.Provider value={{tableEditResponce,setTableEditResponce}}>
      {children}
        </tableEditResponceContext.Provider>
      </tableaddResponceContext.Provider>
      </editResponceContext.Provider>
    </addResponceContext.Provider>
  )
}

export default ContextShare