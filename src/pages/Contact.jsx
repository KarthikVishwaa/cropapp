import React, { useState } from "react";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      alert("Please fill in all fields.");
      return;
    }
    // Here you can integrate email sending or API submission
    setSubmitted(true);
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <div className="max-w-5xl mx-auto p-6 bg-gradient-to-br from-green-50 to-white rounded-2xl shadow-xl">
      <h2 className="text-3xl font-bold text-green-800 mb-6 text-center">Contact Us</h2>

      {submitted ? (
        <p className="text-green-700 text-center font-semibold">
          Thank you! Your message has been submitted.
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-green-700 mb-1 font-medium">Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full border border-green-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>
          <div>
            <label className="block text-green-700 mb-1 font-medium">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full border border-green-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-green-700 mb-1 font-medium">Message</label>
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              rows={5}
              className="w-full border border-green-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-green-400"
            ></textarea>
          </div>
          <div className="md:col-span-2 text-center">
            <button
              type="submit"
              className="bg-green-600 text-white font-semibold px-6 py-2 rounded-md hover:bg-green-700 transition"
            >
              Send Message
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
