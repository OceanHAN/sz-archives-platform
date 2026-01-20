import axios from 'axios';

// API 基础地址（优先使用环境变量 VITE_API_BASE）
const base =
  (import.meta as any).env?.VITE_API_BASE ||
  'http://localhost:3000';

// 统一 axios 实例
const api = axios.create({
  baseURL: base,
  timeout: 8000,
});

// 响应拦截：直接返回 response.data；错误透传
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    return Promise.reject(error);
  }
);

export default api;

/**
 * GET 请求的类型安全封装
 * @param url 请求路径
 * @returns 直接返回业务数据（已通过拦截器提取 data）
 */
export async function getJson<T>(url: string): Promise<T> {
  const data = await api.get(url);
  return data as unknown as T;
}

/**
 * POST 请求的类型安全封装
 * @param url 请求路径
 * @param body 请求体
 * @returns 直接返回业务数据
 */
export async function postJson<T>(url: string, body: any): Promise<T> {
  const data = await api.post(url, body);
  return data as unknown as T;
}
