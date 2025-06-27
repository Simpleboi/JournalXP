import React from "react";

interface Contributor {
  name: string;
  role?: string;
  message?: string;
}

interface ThankYouProps {
  contributors?: Contributor[];
}

const contributors: Contributor[] = [
  {
    name: "Nathaniel Paz",
    role: "Founder & Developer",
    message: "Built this from the heart to help others heal.",
  },
  {
    name: "Haley",
    role: "Inspiration & Support",
    message: "Believed in the vision of JournalXP from day one.",
  },
  {
    name: "Jacobe Cook",
    role: "In Memory",
    message: "Your legacy lives on through every word written here.",
  },
];

const ThankYou = ({ contributors }) => {
  return (
    <div className="bg-gradient-to-b from-indigo-50 to-purple-100 rounded-xl p-6 shadow-md">
      <h2 className="text-2xl font-bold text-indigo-700 mb-4 text-center">
        🙏 Thank You to Our Contributors
      </h2>
      <ul className="space-y-3">
        {contributors.map((contributor, index) => (
          <li
            key={index}
            className="bg-white p-4 rounded-lg shadow-sm border border-indigo-100"
          >
            <p className="text-lg font-semibold text-indigo-600">
              {contributor.name}
            </p>
            {contributor.role && (
              <p className="text-sm text-gray-600">{contributor.role}</p>
            )}
            {contributor.message && (
              <p className="text-sm text-gray-500 mt-1 italic">
                "{contributor.message}"
              </p>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ThankYou;
