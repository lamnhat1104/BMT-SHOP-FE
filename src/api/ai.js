import { BASE_URL } from './config';

export const aiApi = {
  chat: async (message) => {
    const token = localStorage.getItem('token');
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const response = await fetch(`${BASE_URL}/v1/ai/chat`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ message }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Đọc SSE stream và gộp toàn bộ text lại
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let fullText = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      fullText += decoder.decode(value, { stream: true });
    }

    // Xử lý định dạng SSE: "data: ...text...\n\n"
    const lines = fullText.split('\n');
    let result = '';
    for (const line of lines) {
      if (line.startsWith('data:')) {
        result += line.slice(5); // bỏ "data:"
      }
    }

    return result.trim() || fullText.trim();
  }
};
