import { useEffect, useState } from "react";
import { MessageCircle, Send } from "lucide-react";

export default function CommunityForum() {
  const [posts, setPosts] = useState([]);
  const [name, setName] = useState("");
  const [question, setQuestion] = useState("");
  const [replyInputs, setReplyInputs] = useState({});

  /* Load saved posts */
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("forumPosts")) || [];
    setPosts(saved);
  }, []);

  /* Persist posts safely */
  const persistPosts = (updated) => {
    setPosts(updated);
    localStorage.setItem("forumPosts", JSON.stringify(updated));
  };

  const addQuestion = () => {
    if (!name.trim() || !question.trim()) {
      return alert("Enter name and question");
    }

    const newPost = {
      id: Date.now(),
      author: name.trim(),
      question: question.trim(),
      replies: [],
    };

    persistPosts([newPost, ...posts]);
    setQuestion("");
  };

  const addReply = (postId) => {
    const replyText = replyInputs[postId];
    if (!replyText?.trim()) return;

    const updated = posts.map((post) => {
      if (post.id !== postId) return post;

      return {
        ...post,
        replies: [
          ...post.replies,
          { id: Date.now(), text: replyText.trim() },
        ],
      };
    });

    persistPosts(updated);

    setReplyInputs({
      ...replyInputs,
      [postId]: "",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white pb-24">

      {/* Header */}
      <div className="bg-green-700 text-white px-4 py-4 shadow">
        <h1 className="text-lg font-semibold">Community Forum / Q&A</h1>
        <p className="text-xs opacity-80">
          Ask and help fellow farmers
        </p>
      </div>

      {/* Ask Question Card */}
      <div className="p-3">
        <div className="bg-white rounded-2xl shadow-sm border p-3 space-y-2">
          <input
            placeholder="Your Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 text-sm"
          />

          <textarea
            placeholder="Ask your farming question..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 text-sm resize-none"
            rows={3}
          />

          <button
            onClick={addQuestion}
            className="bg-green-600 text-white px-4 py-2 rounded-full text-sm flex items-center gap-2"
          >
            <Send className="w-4 h-4" />
            Post Question
          </button>
        </div>
      </div>

      {/* Feed */}
      <div className="p-3 space-y-3">
        {posts.length === 0 && (
          <div className="text-center text-gray-500 text-sm">
            No discussions yet
          </div>
        )}

        {posts.map((post) => (
          <div
            key={post.id}
            className="bg-white rounded-2xl shadow-sm border p-3"
          >
            {/* Question */}
            <div className="flex items-center gap-2 mb-1">
              <MessageCircle className="w-4 h-4 text-green-600" />
              <p className="text-xs text-gray-500">
                {post.author}
              </p>
            </div>

            <p className="text-sm text-green-900 mb-2 whitespace-pre-wrap">
              {post.question}
            </p>

            {/* Replies */}
            {post.replies.length > 0 && (
              <div className="space-y-1 mb-2">
                {post.replies.map((r) => (
                  <div
                    key={r.id}
                    className="bg-green-50 rounded-lg px-3 py-2 text-sm"
                  >
                    {r.text}
                  </div>
                ))}
              </div>
            )}

            {/* Reply Box */}
            <div className="flex gap-2">
              <input
                placeholder="Write a reply..."
                value={replyInputs[post.id] || ""}
                onChange={(e) =>
                  setReplyInputs({
                    ...replyInputs,
                    [post.id]: e.target.value,
                  })
                }
                className="flex-1 border rounded-full px-3 py-2 text-sm"
              />

              <button
                onClick={() => addReply(post.id)}
                className="bg-green-600 text-white p-2 rounded-full"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
