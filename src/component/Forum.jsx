import React, { useState, useEffect } from "react";

export default function FarmReminder() {
  const [reminders, setReminders] = useState(() => {
    const saved = localStorage.getItem("farmReminders");
    return saved ? JSON.parse(saved) : [];
  });

  const [task, setTask] = useState("");
  const [date, setDate] = useState("");

  // Save to localStorage whenever reminders change
  useEffect(() => {
    localStorage.setItem("farmReminders", JSON.stringify(reminders));
  }, [reminders]);

  const addReminder = () => {
    if (!task || !date) {
      alert("Please enter both task and date/time.");
      return;
    }
    const newReminder = {
      id: Date.now(),
      task,
      date,
      done: false,
    };
    setReminders([newReminder, ...reminders]);
    setTask("");
    setDate("");
  };

  const toggleDone = (id) => {
    setReminders(reminders.map(r => r.id === id ? {...r, done: !r.done} : r));
  };

  const deleteReminder = (id) => {
    setReminders(reminders.filter(r => r.id !== id));
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gradient-to-br from-green-50 to-white rounded-2xl shadow-xl">
      <h2 className="text-3xl font-bold text-green-800 mb-6 text-center">
        Farm Task Reminders
      </h2>

      {/* Add Reminder */}
      <div className="bg-white p-6 rounded-2xl shadow-md mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <input
          type="text"
          placeholder="Task (e.g., Water plants)"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          className="w-full border border-green-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-green-400"
        />
        <input
          type="datetime-local"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full border border-green-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-green-400"
        />
        <button
          onClick={addReminder}
          className="bg-green-600 text-white rounded-md px-4 py-2 hover:bg-green-700 transition"
        >
          Add Reminder
        </button>
      </div>

      {/* Reminder List */}
      {reminders.length > 0 ? (
        <div className="space-y-4">
          {reminders.map(r => (
            <div
              key={r.id}
              className={`bg-white p-4 rounded-2xl shadow-md border-l-4 ${r.done ? 'border-gray-400' : 'border-green-500'} flex justify-between items-center transition hover:scale-105 transform`}
            >
              <div>
                <p className={`text-green-800 font-semibold ${r.done ? 'line-through text-gray-500' : ''}`}>
                  {r.task}
                </p>
                <p className="text-green-700 text-sm">{new Date(r.date).toLocaleString()}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => toggleDone(r.id)}
                  className={`px-3 py-1 rounded-md text-white ${r.done ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-green-600 hover:bg-green-700'} transition`}
                >
                  {r.done ? "Undo" : "Done"}
                </button>
                <button
                  onClick={() => deleteReminder(r.id)}
                  className="px-3 py-1 rounded-md bg-red-600 hover:bg-red-700 text-white transition"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-green-700 text-center">No reminders yet. Add a task to get started!</p>
      )}
    </div>
  );
}
