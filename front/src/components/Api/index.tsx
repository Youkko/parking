import type { AxiosResponse } from "axios"
import type {
  LoginInfo,
  LoginResponse,
  RegisterResponse,
  ArriveResponse,
  DepartResponse,
  ChatResponse,
  UserInfo,
  JwtPayload,
  ParkingInfo,
  PriceInfo,
  UserInfoWithVehicles,
  UserData,
  EditResponse,
  Vehicle,
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

export const getPrices = (): Promise<AxiosResponse<PriceInfo[]>> => {
  return axios.get(`${API_URL}/park/prices`);
}

export const arrive = (plate: string): Promise<AxiosResponse<ArriveResponse>> => {
  return axios.post(`${API_URL}/park/arrive`, { plate })
}

export const depart = (plate: string): Promise<AxiosResponse<DepartResponse>> => {
  return axios.patch(`${API_URL}/park/depart`, { plate })
}

export const chat = (prompt: string): Promise<AxiosResponse<ChatResponse>> => {
  return axios.post(`${API_URL}/chat/`, { prompt })
}

export const getUserData = (): Promise<AxiosResponse<UserInfoWithVehicles>> => {
  return axios.get(`${API_URL}/user/`)
}

export const setUserData = (userData: UserData): Promise<AxiosResponse<EditResponse>> => {
  return axios.patch(`${API_URL}/user/`, userData, {
    headers: { "Content-Type": "application/json" }
  })
}

export const addUserVehicle = (vehicle: Vehicle): Promise<AxiosResponse<EditResponse>> => {
  return axios.post(
    `${API_URL}/user/vehicle`,
    keysToSnake(vehicle),
    {
      headers: { "Content-Type": "application/json" }
    })
}

export const removeUserVehicle = (plate: string): Promise<AxiosResponse<EditResponse>> => {
  return axios.delete(`${API_URL}/user/vehicle`, {
    data: { plate },
    headers: { "Content-Type": "application/json" },
  })
}








type Primitive = string | number | boolean | null

type SnakeCase<S extends string> =
  S extends `${infer First}${infer Rest}`
    ? Rest extends Uncapitalize<Rest>
      ? `${Lowercase<First>}${SnakeCase<Rest>}`
      : `${Lowercase<First>}_${SnakeCase<Rest>}`
    : S

type KeysToSnake<T> =
  T extends Primitive ? T :
  T extends Array<infer V> ? KeysToSnake<V>[] :
  T extends object ? {
    [K in keyof T as K extends string ? SnakeCase<K> : K]:
      KeysToSnake<T[K]>
  } : T

  function camelToSnake(key: string): string {
  return key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`)
}

function keysToSnake<T>(obj: T): KeysToSnake<T> {
  if (Array.isArray(obj)) {
    return obj.map(v => keysToSnake(v)) as KeysToSnake<T>
  }

  if (obj !== null && typeof obj === "object") {
    const result = {} as Record<string, unknown>

    Object.entries(obj as Record<string, unknown>).forEach(([key, value]) => {
      const newKey = camelToSnake(key)
      result[newKey] = keysToSnake(value)
    });

    return result as KeysToSnake<T>
  }

  return obj as KeysToSnake<T>
}
