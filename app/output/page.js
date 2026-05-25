import { useEffect, useState } from "react";
import jsPDF from "jspdf";

export default function OutputPage({ searchParams }) {
  const role = searchParams.role || "";
  const duration = searchParams.duration || "";
  
  const router = useRouter();

  const [roadmap, setRoadmap] = useState(null);
  const [user, setUser] = useState(null);

  const [doneWeeks, setDoneWeeks] = useState({});
  const [activeTab, setActiveTab] = useState("activity");
  const [showProfile, setShowProfile] = useState(false);

  // ================= USER =================
  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));

    if (!currentUser) router.push("/");
    else setUser(currentUser);
  }, [router]);

  // ================= STORAGE KEY (EMAIL BASED) =================
  const getUserKey = () => `user_courses_${user?.email || "guest"}`;

  // ================= LOAD ALL COURSES =================
  useEffect(() => {
    if (!user?.email) return;

    const saved = JSON.parse(localStorage.getItem(getUserKey())) || {};
    const roleData = saved[role] || { doneWeeks: {}, completed: false };

    setDoneWeeks(roleData.doneWeeks || {});
  }, [user, role]);

  // ================= SAVE PROGRESS =================
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

  const desc = (topic) =>
    `Learn ${topic} step by step.
Build strong fundamentals with practice.
Apply skills in real projects.`;

  // ================= LOAD ROADMAP =================
  useEffect(() => {
  const stored = localStorage.getItem("roadmap");

  if (stored) {
    const data = JSON.parse(stored);

    setRoadmap({
      role,
      duration,
      weeks: data, // ✅ API data
    });
  }
}, [role, duration]);

  if (!roadmap) return <p className="p-10">Generating...</p>;

  const totalWeeks = roadmap.weeks.length;
  const completed = Object.values(doneWeeks).filter(Boolean).length;
  const progress = Math.round((completed / totalWeeks) * 100);
  const allDone = completed === totalWeeks;

  // ================= GET ALL COURSES =================
  const getAllCourses = () => {
    if (!user?.email) return [];

    const saved = JSON.parse(localStorage.getItem(getUserKey())) || {};

    return Object.keys(saved).map((key) => ({
      role: key,
      ...saved[key],
    }));
  };

  // ================= CERTIFICATE DOWNLOAD =================
  const downloadCertificate = (courseRole) => {
  if (!user) return;

  const doc = new jsPDF("landscape");

  const name = user?.name || "Student";
  const roleName = courseRole || "Course";
  const date = new Date().toLocaleDateString();

  doc.setLineWidth(2);
  doc.rect(10, 10, 270, 180);
  doc.rect(15, 15, 260, 170);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(30);
  doc.text("CERTIFICATE OF COMPLETION", 148, 55, { align: "center" });

  doc.setFontSize(14);
  doc.setFont("helvetica", "normal");
  doc.text("This is to certify that", 148, 80, { align: "center" });

  doc.setFontSize(24);
  doc.setFont("helvetica", "bold");
  doc.text(name, 148, 95, { align: "center" });

  doc.setFontSize(14);
  doc.setFont("helvetica", "normal");
  doc.text("has successfully completed the course of", 148, 110, {
    align: "center",
  });

  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text(roleName.toUpperCase(), 148, 125, { align: "center" });

  doc.setFontSize(13);
  doc.setFont("helvetica", "normal");
  doc.text(`on ${date}`, 148, 145, {
    align: "center",
  });

  doc.save(`${roleName}_certificate.pdf`);
};

  // ================= UI =================
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-100 to-purple-200">

      {/* SIDEBAR */}
      <div className="w-72 bg-white shadow-xl p-5 flex flex-col h-screen">

        {/* PROFILE */}
        <div
          onClick={() => setShowProfile(!showProfile)}
          className="flex items-center gap-3 cursor-pointer mb-6"
        >
          <div className="w-12 h-12 bg-purple-600 text-white flex items-center justify-center rounded-full">
            👤
          </div>
          <div>
            <p className="font-bold">{user?.name || "User"}</p>
            <p className="text-xs text-gray-500">Profile</p>
          </div>
        </div>

        {/* MENU */}
        <div className="flex flex-col gap-2 flex-1">

          <button
            onClick={() => setActiveTab("activity")}
            className={`p-2 rounded text-left ${
              activeTab === "activity"
                ? "bg-purple-600 text-white"
                : "bg-gray-100"
            }`}
          >
            📌 My Activity
          </button>

          <button
            onClick={() => setActiveTab("certificates")}
            className={`p-2 rounded text-left ${
              activeTab === "certificates"
                ? "bg-purple-600 text-white"
                : "bg-gray-100"
            }`}
          >
            🏆 Certificates
          </button>

          <button
            onClick={() => setActiveTab("progress")}
            className={`p-2 rounded text-left ${
              activeTab === "progress"
                ? "bg-purple-600 text-white"
                : "bg-gray-100"
            }`}
          >
            📊 My Progress
          </button>
        </div>

        {/* LOGOUT */}
        <button
          onClick={() => {
            localStorage.removeItem("currentUser");
            router.push("/");
          }}
          className="mt-auto bg-red-500 text-white py-2 rounded"
        >
           Logout
        </button>
      </div>

      {/* MAIN */}
      <div className="flex-1 p-6">

        <h1 className="text-3xl font-bold text-purple-700">
          {roadmap.role.toUpperCase()}
        </h1>

        <p className="text-gray-600 mb-6">
          Duration: {roadmap.duration}
        </p>

        {/* ACTIVITY */}
        {activeTab === "activity" && (
          <div className="flex flex-col gap-6">

            {roadmap.weeks.map((item) => {
              const isDone = doneWeeks[item.week];

              return (
                <div
                  key={item.week}
                  className={`bg-white p-5 rounded-xl shadow flex justify-between border-l-4 ${
                    isDone ? "border-green-500" : "border-gray-300"
                  }`}
                >

                  <div className="w-2/3">
                    <h2 className="text-blue-600 font-bold">
                      Week {item.week}
                    </h2>

                    <p className="font-semibold">{item.topic}</p>

                    <p className="text-sm text-gray-600 whitespace-pre-line mt-2">
                      {desc(item.topic)}
                    </p>

                    <button
                      onClick={() => toggleDone(item.week)}
                      className={`mt-3 px-3 py-2 rounded text-white ${
                        isDone ? "bg-red-500" : "bg-green-500"
                      }`}
                    >
                      {isDone ? "Mark Undone" : "Mark Done"}
                    </button>
                  </div>

                  <div className="w-1/3 flex flex-col items-end gap-2 mt-6">
                    <a className="text-blue-600 underline" target="_blank"
                      href={`https://www.google.com/search?q=${item.topic}+notes`}>
                      📘 Notes
                    </a>

                    <a className="text-green-600 underline" target="_blank"
                      href={`https://www.google.com/search?q=${item.topic}+pdf`}>
                      📥 PDF
                    </a>

                    <a className="text-red-500 underline" target="_blank"
                      href={`https://www.youtube.com/results?search_query=${item.topic}`}>
                      ▶ Video
                    </a>
                  </div>

                </div>
              );
            })}
          </div>
        )}

        {/* CERTIFICATES */}
        {activeTab === "certificates" && (
          <div className="bg-white p-6 rounded-xl shadow">

            <h2 className="text-xl font-bold mb-4">🏆 Certificates</h2>

            {getAllCourses()
              .filter((c) => c.completed)
              .map((c, i) => (
                <div key={i} className="border p-3 rounded mb-3">
                  <p className="font-bold">{c.role}</p>

                  <button
                    onClick={() => downloadCertificate(c.role)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded mt-2"
                  >
                    Download Certificate
                  </button>
                </div>
              ))}

          </div>
        )}

        {/* PROGRESS */}
        {activeTab === "progress" && (
          <div className="bg-white p-6 rounded-xl shadow">

            <h2 className="text-xl font-bold mb-4">📊 My Courses</h2>

            {getAllCourses().map((course, i) => (
              <div key={i} className="border p-3 rounded mb-3">

                <p className="font-bold">{course.role}</p>

                {course.completed ? (
                  <p className="text-green-600">✔ Completed</p>
                ) : (
                  <p className="text-orange-500">
                    🔄 In Progress ({course.progress || 0}%)
                  </p>
                )}

              </div>
            ))}

          </div>
        )}

      </div>
    </div>
  );
}
