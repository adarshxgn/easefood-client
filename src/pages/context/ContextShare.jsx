import React, { createContext, useState } from 'react'
export const addResponceContext = createContext()
export const editResponceContext = createContext()
export const tableaddResponceContext = createContext()
export const tableEditResponceContext = createContext()
export const orderContext = createContext()

const ContextShare = ({children}) => {
  const[addResponce, setAddResponce] = useState("")
  const[editResponce,setEditResponce] = useState("")
  const[tableaddResponce, setTableAddResponce] = useState("")
  const[tableEditResponce,setTableEditResponce] = useState("")
  const[orderUpdate, setOrderUpdate] = useState(false)

  return (
    <addResponceContext.Provider value={{addResponce, setAddResponce}}>
      <editResponceContext.Provider value={{editResponce,setEditResponce}}>
        <tableaddResponceContext.Provider value={{tableaddResponce, setTableAddResponce}}>
          <tableEditResponceContext.Provider value={{tableEditResponce,setTableEditResponce}}>
            <orderContext.Provider value={{orderUpdate, setOrderUpdate}}>
              {children}
            </orderContext.Provider>
          </tableEditResponceContext.Provider>
        </tableaddResponceContext.Provider>
      </editResponceContext.Provider>
    </addResponceContext.Provider>
  )
}

export default ContextShare