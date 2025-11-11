import type {
  UserProviderProps,
  UserInfo,
  UserContextType,
} from '../../interfaces'
import { createContext, useContext, useState, useEffect } from 'react'

const UserContext = createContext<UserContextType | undefined>(undefined)

export const UserProvider = ({ children }: UserProviderProps) => {

  const [userInfo, setUserInfo] = useState<UserInfo | null>(null)

  useEffect(() => {
    const storedUser = localStorage.getItem("userInfo")
    if (storedUser) {
      try {
        setUserInfo(JSON.parse(storedUser))
      } catch {
        setUserInfo(null)
      }
    } else {
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