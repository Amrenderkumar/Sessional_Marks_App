import React from 'react'

const Card = () => {
const cardsdata = [
    {
      label: "Current Status",
      value:  "pass",
      sub: "Overall status",
      icon: "🎓",
      valueClass: "text-green-600 font-extrabold text-2xl",
      border: "border-l-4 border-gray-900",
    },
    {
      label: "Percentage",
      value:  "85%",
      sub: "Total marks",
      icon: "📈",
      valueClass: "text-gray-900 font-extrabold text-2xl",
      border: "border-l-4 border-amber-400",
    },
    {
      label: "Grade",
      value:  "A",
      sub: "Overall grade",
      icon: "🏅",
      valueClass: "text-gray-900 font-extrabold text-2xl",
      border: "border-l-4 border-gray-600",
    },
    {
      label: "Total Marks",
      value:  "4/5",
      sub: "Sum of all subjects",
      icon: "📚",
      valueClass: "text-gray-900 font-extrabold text-2xl",
      border: "border-l-4 border-gray-400",
    },
  ];
 
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      {cardsdata.map((card, idx) => (
        <div
          key={idx}
          className={`bg-white rounded-xl shadow-sm p-5 ${card.border} hover:shadow-md transition-shadow duration-200`}
        >
          <div className="flex justify-between items-start mb-3">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              {card.label}
            </span>
            <span className="text-lg">{card.icon}</span>
          </div>
          <div className={card.valueClass}>{card.value}</div>
          <div className="text-xs text-gray-400 mt-1">{card.sub}</div>
        </div>
      ))}
    </div>
  );
}
export default Card;
