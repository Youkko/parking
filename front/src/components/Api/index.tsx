import type { AxiosResponse } from "axios"
import type {
  LoginInfo,
  LoginResponse,
  RegisterResponse,
  ArriveResponse,
  DepartResponse,
  UserInfo,
  JwtPayload,
  ParkingInfo,
} from "../../interfaces"
import axios from "axios"
import { jwtDecode } from "jwt-decode"

const API_URL = "http://localhost:5000"

export const setAuthToken = (token: string | null): void => {
  if (token) axios.defaults.headers.common["Authorization"] = `Bearer ${token}`
  else delete axios.defaults.headers.common["Authorization"]
}

export const login = async (
  loginInfo: LoginInfo
): Promise<UserInfo | null> => {
  const response: AxiosResponse<LoginResponse> = await axios.post(
    `${API_URL}/auth/login`,
    loginInfo
  )
  try
  {
    const responseData: LoginResponse = response.data
    const token = responseData.access_token
    const decoded: JwtPayload = jwtDecode(token)
    const user: UserInfo = {
      id: decoded.id,
      email: decoded.email,
      createdAt: decoded.created_at,
      authorization: token,
    }
    return user
  }
  catch
  {
    return null
  }
}

export const register = async (
  registerInfo: LoginInfo
): Promise<AxiosResponse<RegisterResponse>> => {
  return axios.post(`${API_URL}/auth/register`, registerInfo)
}

export const getMovements = (): Promise<AxiosResponse<ParkingInfo[]>> => {
  return axios.get(`${API_URL}/park/`);
}

export const arrive = (plate: string): Promise<AxiosResponse<ArriveResponse>> => {
  return axios.post(`${API_URL}/park/arrive`, { plate })
}

export const depart = (plate: string): Promise<AxiosResponse<DepartResponse>> => {
  return axios.patch(`${API_URL}/park/depart`, { plate })
}