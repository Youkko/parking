export interface TopBarProps {
  handleLogout: () => void
  handleEditUserInfo: () => void
  showModal: () => void
  setLoginMode: (isLogin: boolean) => void
  loggedInUser?: any
}

export interface ContentPanelProps {
  children?: React.ReactNode
}

export interface CredentialsPanelProps {
  onLogin: (email: string, password: string) => void
  onRegister: (email: string, password: string) => void
  onCancel: () => void
  isLoginMode: boolean
  visible: boolean
}

export interface JwtPayload {
  id: string
  email: string
  created_at: string
}

export interface ParkingInfo {
  id: string
  plate: string
  arrival: string
  departure?: string
  durationSeconds: number
}

export interface MenuProps {
  pageSetter: (pageComponent: React.ReactNode) => void
}

export interface LoginInfo {
  email: string
  password: string
}

export interface UserInfo {
  id: string
  email: string
  createdAt: string
  authorization: string
}