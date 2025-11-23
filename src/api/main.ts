import axiosInstance from "./apiClient";

export const getMain = async () => {
  return await axiosInstance.get(`/main`);
}

export const getBookSearch = async (query: string) => {
  return await axiosInstance.get(`/api/search?keyword=${query}`)
}