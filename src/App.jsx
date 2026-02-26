import { use, useEffect, useState } from "react";
import ChatWithLlama from "./components/ChatWithLlama";
import { getCurrentWeather } from "./utils/getCurrentWeather";
import { getLocation } from "./utils/getLocation";

export default function App() {

  const [weather, setWeather] = useState(null);
  const [location, setLocation] = useState(null);

  async function fetchData() {
    const weather = await getCurrentWeather()
    const location = await getLocation()
    setWeather(weather)
    setLocation(location)
  }

  useEffect(() => {
    fetchData()
  }, [])

  if (!weather || !location) {
    return <div>Loading...</div>
  }

  return (
    <div>
      <h1>Chat with Llama 3.1</h1>

      <ChatWithLlama
        role="user"
        content={`Give me a list of activity ideas based on my current location of ${location} and weather of ${weather}`}
      />
    </div>
  );
}
