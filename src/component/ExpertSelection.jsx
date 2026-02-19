import { useNavigate } from "react-router-dom";
import { Sprout, Droplets, Bug, TrendingUp, Leaf } from "lucide-react";

const experts = [
  {
    id: "general",
    name: "Agri Expert",
    desc: "General crop & farming guidance",
    icon: Sprout,
    color: "bg-green-100",
  },
  {
    id: "soil",
    name: "Soil Expert",
    desc: "Soil health & fertilizers",
    icon: Leaf,
    color: "bg-emerald-100",
  },
  {
    id: "irrigation",
    name: "Irrigation Expert",
    desc: "Water & irrigation management",
    icon: Droplets,
    color: "bg-blue-100",
  },
  {
    id: "pest",
    name: "Pest & Disease Expert",
    desc: "Pests, diseases & prevention",
    icon: Bug,
    color: "bg-red-100",
  },
  {
    id: "market",
    name: "Market Advisor",
    desc: "Prices & selling decisions",
    icon: TrendingUp,
    color: "bg-yellow-100",
  },
];

export default function ExpertSelection() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white p-5">
      <h1 className="text-2xl font-bold text-green-800 mb-4">
        Choose Your Expert
      </h1>

      <div className="space-y-3">
        {experts.map((expert) => {
          const Icon = expert.icon;

          return (
            <button
              key={expert.id}
              onClick={() => navigate(`/chat/${expert.id}`)}
              className="w-full flex items-center gap-4 bg-white rounded-2xl shadow-sm border p-4 active:scale-[0.98] transition"
            >
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center ${expert.color}`}
              >
                <Icon className="w-6 h-6 text-green-700" />
              </div>

              <div className="text-left">
                <p className="font-semibold text-green-900">
                  {expert.name}
                </p>
                <p className="text-xs text-gray-500">
                  {expert.desc}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
