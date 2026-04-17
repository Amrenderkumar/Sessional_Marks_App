import React from 'react'

const gradeColors = {
  "A+": "bg-emerald-700",
  A: "bg-gray-800",
  "B+": "bg-amber-600",
  B: "bg-blue-700",
  C: "bg-orange-600",
};

const Suboverview = () => {
    return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="mb-5">
        <h2 className="text-base font-bold text-gray-900">Subject Overview</h2>
        <p className="text-xs text-gray-400 mt-0.5">
          Performance for ....
        </p>
      </div>
 
      <div className="space-y-4">
        {subjects.map((sub, idx) => {
          const pct = (sub.obtained / sub.total) * 100;
          return (
            <div key={idx} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
              <div className="flex justify-between items-center mb-2">
                <div>
                  <span className="font-semibold text-gray-800 text-sm">
                    {sub.name}
                  </span>
                  <span className="ml-2 text-xs text-gray-400 font-mono">
                    {sub.code}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="font-bold text-gray-800 text-sm">
                      {sub.obtained}/{sub.total}
                    </span>
                    <p className="text-xs text-gray-400">
                      Passing: {sub.passing}
                    </p>
                  </div>
                  <span
                    className={`text-white text-xs font-bold px-2 py-1 rounded-md ${
                      gradeColors[sub.grade] || "bg-gray-700"
                    }`}
                  >
                    {sub.grade}
                  </span>
                </div>
              </div>
              {/* Progress Bar */}
              <div className="w-full bg-gray-100 rounded-full h-1.5">
                <div
                  className="bg-gray-800 h-1.5 rounded-full transition-all duration-500"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Suboverview
