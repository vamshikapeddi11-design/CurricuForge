"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import jsPDF from "jspdf";

export default function OutputPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const role = searchParams.get("role");
  const duration = searchParams.get("duration");

  const [roadmap, setRoadmap] = useState(null);
  const [user, setUser] = useState(null);

  const [doneWeeks, setDoneWeeks] = useState({});
  const [activeTab, setActiveTab] = useState("activity");

  // ================= USER =================
  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));

    if (!currentUser) {
      router.push("/");
    } else {
      setUser(currentUser);
    }
  }, [router]);

  // ================= VALIDATE PARAMS =================
  useEffect(() => {
    if (!role || !duration) {
      router.push("/dashboard"); // 🔥 IMPORTANT FIX
    }
  }, [role, duration, router]);

  // ================= STORAGE KEY =================
  const getUserKey = () => `user_courses_${user?.email || "guest"}`;

  // ================= LOAD COURSE =================
  useEffect(() => {
    if (!user?.email || !role) return;

    const saved = JSON.parse(localStorage.getItem(getUserKey())) || {};
    const roleData = saved[role] || { doneWeeks: {}, completed: false };

    setDoneWeeks(roleData.doneWeeks || {});
  }, [user, role]);

  // ================= SAVE =================
  const toggleDone = (week) => {
    const updated = { ...doneWeeks, [week]: !doneWeeks[week] };
    setDoneWeeks(updated);

    const saved = JSON.parse(localStorage.getItem(getUserKey())) || {};

    const totalWeeks = roadmap?.weeks?.length || 1;
    const completedCount = Object.values(updated).filter(Boolean).length;

    saved[role] = {
      doneWeeks: updated,
      completed: completedCount === totalWeeks,
      progress: Math.round((completedCount / totalWeeks) * 100),
    };

    localStorage.setItem(getUserKey(), JSON.stringify(saved));
  };

  // ================= TOPICS =================
  const getTopics = (role) => {
    const r = role.toLowerCase().trim();

    if (r === "web developer") return ["HTML", "CSS", "JS", "React", "Node"];
    if (r === "python developer") return ["Python", "OOP", "Flask", "Django", "APIs"];
    if (r === "data analyst") return ["Excel", "SQL", "Python", "Pandas", "Power BI"];
    if (r === "java developer") return ["Java", "OOP", "Spring Boot", "APIs"];
    if (r === "software engineer") return ["DSA", "OOP", "DBMS", "OS"];
    if (r === "frontend developer") return ["HTML", "CSS", "JS", "React"];
    if (r === "backend developer") return ["Node", "Express", "APIs", "DB"];
    if (r === "full stack developer") return ["Frontend", "Backend", "React", "Node"];
    if (r === "ai engineer") return ["Python", "ML", "DL", "NLP"];
    if (r === "devops engineer") return ["Linux", "Git", "Docker", "AWS"];

    return ["Invalid Role"];
  };

  const generateWeeks = (topics, duration) => {
    const totalWeeks = duration.includes("month")
      ? parseInt(duration) * 4
      : 4;

    let weeks = [];
    let i = 0;

    for (let w = 1; w <= totalWeeks; w++) {
      weeks.push({ week: w, topic: topics[i % topics.length] });
      i++;
    }

    return weeks;
  };

  // ================= LOAD ROADMAP =================
  useEffect(() => {
    if (!role || !duration) return;

    const topics = getTopics(role);

    setRoadmap({
      role,
      duration,
      weeks: generateWeeks(topics, duration),
      invalid: topics[0] === "Invalid Role",
    });
  }, [role, duration]);

  if (!roadmap) return <p className="p-10">Generating...</p>;

  const totalWeeks = roadmap.weeks.length;
  const completed = Object.values(doneWeeks).filter(Boolean).length;
  const progress = Math.round((completed / totalWeeks) * 100);

  // ================= UI =================
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-purple-700">
        {roadmap.role.toUpperCase()}
      </h1>

      <p className="mb-4">Duration: {roadmap.duration}</p>

      <p className="mb-4">Progress: {progress}%</p>

      {roadmap.weeks.map((item) => {
        const isDone = doneWeeks[item.week];

        return (
          <div key={item.week} className="border p-4 mb-3 rounded">
            <h2>Week {item.week}</h2>
            <p>{item.topic}</p>

            <button
              onClick={() => toggleDone(item.week)}
              className={`px-3 py-1 mt-2 text-white rounded ${
                isDone ? "bg-red-500" : "bg-green-500"
              }`}
            >
              {isDone ? "Undo" : "Done"}
            </button>
          </div>
        );
      })}
    </div>
  );
}
