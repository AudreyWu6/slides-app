// api.js
export async function apiRequest (url, method, body = null) {
  const headers = { 'Content-Type': 'application/json' };
  // eslint-disable-next-line no-useless-catch
  try {
    const response = await fetch('http://localhost:5005' + url, {
      method,
      headers,
      body: JSON.stringify(body),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Something went wrong');
    }
    return data;
  } catch (error) {
    throw error;
  }
}
