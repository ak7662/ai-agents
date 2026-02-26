import { useState } from "react";

export default function ChatWithLlama({ role = "user", content = "" }) {
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const callLlamaAPI = async () => {
    setLoading(true);
    setResponse("");


    const systemPrompt = `
You cycle through Thought, Action, PAUSE, Observation. At the end of the loop you output a final Answer. Your final answer should be highly specific to the observations you have from running
the actions.
1. Thought: Describe your thoughts about the question you have been asked.
2. Action: run one of the actions available to you - then return PAUSE.
3. PAUSE
4. Observation: will be the result of running those actions.

Available actions:
- getCurrentWeather: 
    E.g. getCurrentWeather: Salt Lake City
    Returns the current weather of the location specified.
- getLocation:
    E.g. getLocation: null
    Returns user's location details. No arguments needed.

Example session:
Question: Please give me some ideas for activities to do this afternoon.
Thought: I should look up the user's location so I can give location-specific activity ideas.
Action: getLocation: null
PAUSE

You will be called again with something like this:
Observation: "New York City, NY"

Then you loop again:
Thought: To get even more specific activity ideas, I should get the current weather at the user's location.
Action: getCurrentWeather: New York City
PAUSE

You'll then be called again with something like this:
Observation: { location: "New York City, NY", forecast: ["sunny"] }

You then output:
Answer: <Suggested activities based on sunny weather that are highly specific to New York City and surrounding areas.>
`
    try {
      const response = await fetch("http://localhost:11434/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "llama3.1:8b",
          messages: [
            {
              role: "system",
              content: systemPrompt,
            },
            {
              role: role,
              content: content,
            },
          ],
          stream: false,
        }),
      });

      const data = await response.json();

      const responseText = data.message.content
      const responseLines = responseText.split("\n")
      console.log(responseLines)

      const actionRegex = /^1. (\w+): (.*)$/
      const foundActionStr = responseLines.find(str => actionRegex.test(str))
      const actions = actionRegex["exec"](foundActionStr)
      const [_, action, actionArg] = actions
      const observation = await availableFunctions[action](actionArg)
      console.log(observation)

      // Ollama response structure: data.message.content
      setResponse(data?.message?.content || "No response");
    } catch (error) {
      setResponse("Error: " + error.message);
    }

    setLoading(false);
  };

  return (
    <div style={{ padding: "16px", border: "1px solid #ccc", borderRadius: "8px" }}>
      <button onClick={callLlamaAPI} disabled={loading}>
        {loading ? "Thinking..." : "Send to Llama3.1:8b"}
      </button>

      {response && (
        <div style={{ marginTop: "12px", whiteSpace: "pre-wrap" }}>
          <strong>Response:</strong>
          <p>{response}</p>
        </div>
      )}
    </div>
  );
}
