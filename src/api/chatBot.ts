export const postMessage = async (userName: string, content: string, onChunk?: (text: string) => void) => {
  const Server_IP = import.meta.env.VITE_APP_AI_Server_IP;
  const res = await fetch(`${Server_IP}/chatbot/Bookshelf_AI`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user_id: userName, user_said: content }),
  });

  if (!res.body) return "서버 스트리밍이 지원되지 않습니다.";

  const reader = res.body.getReader();
  const decoder = new TextDecoder("utf-8");
  let fullText = "";

  while (true) {
    const { done, value } = await reader.read(); //실시간으로 chunk 받아오기
    if (done) break; //chunk 다 받아오면 done이 true 되면서 while문 탈출
    const chunk = decoder.decode(value, { stream: true });
    fullText += chunk
    /*chunk를 문자열로 해석하지만 { stream: true } 으로 이 데이터가 끝이 아닐 수도 있으니까 다음 chunk까지 기다려 문자열이 깨지지 않도록 함*/
    if (onChunk) onChunk(chunk);
  }

  return fullText;
};
