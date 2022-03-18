const API_END_POINT = "http://localhost:4000";

export const request = async (url, options = {}) => {
  try {
    const fullUrl = `${API_END_POINT}${url}`;
    const response = await fetch(fullUrl, options);

    if (response.ok) {
      const json = response.json();
      return json;
    }
    throw new Error("API 통신 실패");
  } catch (error) {
    alert(error.message);
  }
};
