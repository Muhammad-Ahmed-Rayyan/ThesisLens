import { useState, useCallback } from "react";

export function useResearchStream() {
  const [steps, setSteps] = useState([]);
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const runAnalysis = useCallback(async (input, maxPapers = 12) => {
    setSteps([]);
    setResult(null);
    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:8000/api/research/analyze/stream", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input, max_papers: maxPapers }),
      });

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const text = decoder.decode(value);
        const lines = text.split("\n").filter((l) => l.startsWith("data: "));

        for (const line of lines) {
          const data = JSON.parse(line.slice(6));

          if (data.type === "progress") {
            setSteps((prev) => [...prev, data]);
          } else if (data.type === "result") {
            setResult(data);
            setIsLoading(false);
          } else if (data.type === "error") {
            setError(data.message);
            setIsLoading(false);
          }
        }
      }
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
    }
  }, []);

  return { steps, result, isLoading, error, runAnalysis };
}
