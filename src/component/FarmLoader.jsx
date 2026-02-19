import { Sprout, Sun, Tractor } from "lucide-react";

export default function FarmLoader() {
  return (
    <div className="flex flex-col items-center justify-center py-6">
      <div className="flex gap-6 animate-pulse text-green-600">
        <Sprout className="w-8 h-8" />
        <Sun className="w-8 h-8" />
        <Tractor className="w-8 h-8" />
      </div>

      <p className="text-green-700 text-sm mt-3">
        Analyzing Please wait.......
      </p>
    </div>
  );
}
