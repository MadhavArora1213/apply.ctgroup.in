"use client";

import React, { Suspense, useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  Cog,
  Clapperboard,
  BookOpenCheck,
  Scale,
  HardHat,
  Calculator,
  Monitor,
  Pill,
  Camera,
  Computer,
  TrainFrontTunnel,
  Heart,
  Atom,
  Hotel,
  Activity,
} from "lucide-react";

// Disciplines data
const disciplines = [
  { icon: Cog, name: "Engineering", color: "from-blue-400 to-indigo-600" },
  {
    icon: Clapperboard,
    name: "Multimedia",
    color: "from-green-400 to-emerald-600",
  },
  { icon: Scale, name: "Law", color: "from-purple-400 to-indigo-600" },
  {
    icon: HardHat,
    name: "Architecture",
    color: "from-yellow-400 to-orange-600",
  },
  { icon: Calculator, name: "Commerce", color: "from-pink-400 to-rose-600" },
  {
    icon: Monitor,
    name: "Computer Science",
    color: "from-cyan-400 to-blue-600",
  },
  { icon: Pill, name: "Pharmacy", color: "from-red-400 to-rose-600" },
  {
    icon: Camera,
    name: "Journalism & Mass Communication",
    color: "from-teal-400 to-green-600",
  },
  {
    icon: Computer,
    name: "Computer Applications",
    color: "from-yellow-400 to-amber-600",
  },
  {
    icon: TrainFrontTunnel,
    name: "Fashion Design",
    color: "from-purple-400 to-pink-600",
  },
  {
    icon: Heart,
    name: "Hospitality & Tourism",
    color: "from-red-400 to-pink-600",
  },
  {
    icon: Atom,
    name: "IOT",
    color: "from-indigo-400 to-purple-600",
  },
  {
    icon: BookOpenCheck,
    name: "Polytechnic",
    color: "from-sky-400 to-blue-600",
  },
  { icon: Activity, name: "Physiotherapy", color: "from-blue-400 to-cyan-600" },
  {
    icon: Hotel,
    name: "Hotel Management",
    color: "from-amber-400 to-orange-600",
  },
];

// DisciplineCard component
const DisciplineCard = ({ icon: Icon, name, color, index }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  const variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        delay: index * 0.1,
      },
    },
  };

  return (
    <motion.div
      ref={ref}
      variants={variants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      className="relative group"
    >
      <div
        className="h-full rounded-xl p-4 bg-white shadow-md shadow-indigo-100/20 border border-indigo-50 
        transition-all duration-300 hover:shadow-lg hover:shadow-indigo-200/30 relative z-10"
      >
        <div
          className={`absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-br ${color} transition-opacity duration-300 -z-10`}
        />
        <div className="flex flex-col items-center text-center space-y-3">
          <div className="p-3 rounded-full bg-indigo-50 group-hover:bg-white/90 transition-colors duration-300">
            <Icon className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-sm font-semibold text-gray-900 group-hover:text-indigo-900 transition-colors duration-300">
            {name}
          </h2>
        </div>
      </div>
    </motion.div>
  );
};

// ErrorBoundary component
const ErrorBoundary = ({ children }) => {
  const [hasError, setHasError] = React.useState(false);

  const handleError = () => {
    setHasError(false);
  };

  if (hasError) {
    return (
      <div className="p-4 text-center">
        <h2 className="text-lg font-semibold text-red-600">
          Oops, there was an error!
        </h2>
        <button
          className="mt-2 px-4 py-2 text-sm text-white bg-red-600 rounded hover:bg-red-700"
          onClick={handleError}
        >
          Try again
        </button>
      </div>
    );
  }

  return <>{children}</>;
};

// Main AcademicDisciplines component
export default function AcademicDisciplines() {
  return (
    <div className="h-auto bg-gradient-to-br from-gray-50 to-gray-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-primary mb-3">
            Academic Disciplines
          </h1>
          <p className="text-lg sm:text-xl lg:text-2xl font-bold text-[#cf9300]">
            Explore our diverse range of academic programs
          </p>
        </motion.div>

        <ErrorBoundary>
          <Suspense
            fallback={
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {[...Array(12)].map((_, i) => (
                  <div
                    key={i}
                    className="h-28 rounded-xl bg-gray-200 animate-pulse"
                  />
                ))}
              </div>
            }
          >
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"
            >
              {disciplines.map((discipline, index) => (
                <DisciplineCard
                  key={discipline.name}
                  icon={discipline.icon}
                  name={discipline.name}
                  color={discipline.color}
                  index={index}
                />
              ))}
            </motion.div>
          </Suspense>
        </ErrorBoundary>
      </div>
    </div>
  );
}
