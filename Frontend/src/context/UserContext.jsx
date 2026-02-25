import React, { createContext, useState } from 'react'

export const UserDataContext = createContext()

const userContext = ({children}) => {

    const [user, setUser] = useState({
        email: '',
        username: '',
        
    })
  return (
    <div>
      <UserDataContext.Provider value={{}}>
        {children}
      </UserDataContext.Provider>
    </div>
  )
}

export default userContext
