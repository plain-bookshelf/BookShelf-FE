import axios from "axios";



export const postRecommand = async (userName: string) => {
  const Server_IP = import.meta.env.VITE_APP_AI_Server_IP;
  return await axios.post(`${Server_IP}/books/book_post`, { user_name: Number(userName) })
}