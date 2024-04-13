export async function apiRequestStore (url, token, method, body = null) {
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`
  };

  const requestOptions = {
    method,
    headers,
  };

  if (method !== 'GET' && body !== null) {
    requestOptions.body = JSON.stringify(body);
  }
  const response = await fetch(`http://localhost:5005${url}`, requestOptions);
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong');
  }
  return data;
}
