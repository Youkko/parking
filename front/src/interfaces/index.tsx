export interface TopBarProps {
  handleLogout: () => void
  handleEditUserInfo: () => void
  showModal: () => void
  setLoginMode: (isLogin: boolean) => void
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
  resetFieldsTrigger: number
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

export interface LoginResponse {
  access_token: string
}

export interface ArriveResponse {
  message: string
}

export interface DepartResponse {
  message: string
}

export interface RegisterResponse {
  message: string
}

export interface UserInfo {
  id: string
  email: string
  createdAt: string
  authorization: string
}

export interface UserProviderProps {
  children: React.ReactNode
}

export interface UserContextType {
  userInfo: UserInfo | null;
  setUserInfo: React.Dispatch<React.SetStateAction<UserInfo | null>>;
}