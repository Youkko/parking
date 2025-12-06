import type { SetStateAction, Dispatch } from "react"

export interface TopBarProps {
  handleLogout: () => void
  handleEditUserInfo: () => void
  showModal: () => void
  setLoginMode: (isLogin: boolean) => void
  userEditInfo: UserInfoWithVehicles | null
  setUserEditInfo: Dispatch<SetStateAction<UserInfoWithVehicles | null>>
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

export interface InfoEditorProps {
  onSave: (name: string, email: string, password: string, newpassword: string) => void
  onCancel: () => void
  onDelete: () => void
  setUserEditInfo: Dispatch<SetStateAction<UserInfoWithVehicles | null>>
  userEditInfo?: UserInfoWithVehicles | null
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

export interface EditResponse {
  message: string
}

export interface UserInfo {
  id: string
  email: string
  createdAt: string
  authorization: string
}

export interface PriceInfo {
  id: string
  description: string
  grace: number
  value_day: number
  value_hour: number
  value_fraction: number
  created_at: string
}

export interface UserProviderProps {
  children: React.ReactNode
}

export interface UserContextType {
  userInfo: UserInfo | null;
  setUserInfo: React.Dispatch<React.SetStateAction<UserInfo | null>>;
}

export interface ChatWidgetProps {
  onSend: (message: ChatMessage) => Promise<ChatResponse | void>
}

export interface ChatMessage {
  sender: "user" | "bot"
  prompt: string
}

export interface ChatResponse {
  assistant: string
  raw_response: string
}

export interface UserInfoWithVehicles {
  id: string
  name: string
  email: string
  createdAt: string
  vehicles: Vehicle[]
}

export interface Vehicle {
  plate: string
  isMotorcycle: boolean
  isActive: string
  createdAt: string
}

export interface UserData {
  name: string | null
  email: string
  password: string
  newPassword: string | null
}