import type {
  UserProviderProps,
  UserInfo,
  UserContextType,
} from '../../interfaces'
import {
  setAuthToken,
} from "../../components/Api"
import { createContext, useContext, useState, useEffect } from 'react'

const UserContext = createContext<UserContextType | undefined>(undefined)

export const UserProvider = ({ children }: UserProviderProps) => {

  const [userInfo, setUserInfo] = useState<UserInfo | null>(null)

  useEffect(() => {
    const storedUser = localStorage.getItem("userInfo")
    if (storedUser) {
      try {
        const user: UserInfo = JSON.parse(storedUser)
        setAuthToken(user.authorization)
        setUserInfo(user)
      } catch {
        setAuthToken(null)
        setUserInfo(null)
      }
    } else {
      setAuthToken(null)
      setUserInfo(null)
    }
  }, [])

  return (
    <UserContext.Provider value={{ userInfo, setUserInfo }}>
      {children}
    </UserContext.Provider>
  )
}

export const useUser = (): UserContextType => {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error("useUser must be used within a UserProvider")
  }
  return context
}