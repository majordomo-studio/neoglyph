import axios from "axios";

export const fetchData = async () => {
  try {
    const response = await axios.get("/data.json");
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw new Error("Could not fetch data.");
  }
};
