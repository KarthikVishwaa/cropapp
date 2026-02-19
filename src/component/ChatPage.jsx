import { useState } from "react";
import OpenAI from "openai";
import FarmLoader from "../component/FarmLoader";
import { Send } from "lucide-react";

export default function ChatWithAgriExpert() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Vanakkam! I’m your Agri Expert. How can I help you today?",
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const client = new OpenAI({
    apiKey: process.env.REACT_APP_OPENAI_KEY,
    dangerouslyAllowBrowser: true,
  });

  const sendMessage = async () => {
    if (!input.trim()) return;

    const updatedMessages = [
      ...messages,
      { role: "user", content: input },
    ];

    setMessages(updatedMessages);
    setInput("");
    setLoading(true);

    try {
      const response = await client.chat.completions.create({
        model: "gpt-4o-mini",
        temperature: 0.4,
        messages: [
          {
            role: "system",
            content: `
You are an agricultural expert helping farmers.
Give clear, practical advice.
Avoid unsafe chemical dosages.
Keep responses concise.
`,
          },
          ...updatedMessages,
        ],
      });

      const aiReply = response.choices[0].message.content;

      setMessages([
        ...updatedMessages,
        { role: "assistant", content: aiReply },
      ]);
    } catch (err) {
      console.error(err);

      setMessages([
        ...updatedMessages,
        {
          role: "assistant",
          content: "Network issue. Please try again.",
        },
      ]);
    }

    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-[#efeae2] flex flex-col">

      {/* Header */}
      <div className="bg-green-700 text-white px-4 py-3 shadow-md">
        <h2 className="text-sm font-semibold">Agri Expert</h2>
        <p className="text-xs opacity-80">online</p>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-2 pb-24">
        {/* ✅ pb-24 prevents overlap with input/nav */}

        {messages.map((msg, i) => (
          <div
            key={i}
            className={`max-w-[75%] px-3 py-2 rounded-lg text-sm whitespace-pre-wrap break-words
              ${
                msg.role === "user"
                  ? "ml-auto bg-[#dcf8c6] text-black rounded-br-none"
                  : "bg-white text-black rounded-bl-none"
              }`}
          >
            {msg.content}
          </div>
        ))}

        {loading && (
          <div className="max-w-[60%] bg-white px-3 py-2 rounded-lg">
            <FarmLoader />
          </div>
        )}
      </div>

      {/* Input Bar */}
      <div className="bg-[#f0f0f0] px-3 py-2 flex items-center gap-2 mb-16">
        {/* ✅ mb-16 clears BottomPillNav */}

        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message"
          className="flex-1 bg-white rounded-full px-4 py-2 text-sm border border-gray-300 focus:outline-none"
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />

        <button
          onClick={sendMessage}
          className="bg-green-600 text-white p-2 rounded-full active:scale-95"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
