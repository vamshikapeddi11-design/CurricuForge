"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const router = useRouter();

  const [role, setRole] = useState("");
  const [duration, setDuration] = useState("");
  const [user, setUser] = useState(null);
  const [openProfile, setOpenProfile] = useState(false);

  // ✅ LOAD USER
  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser");

    if (!storedUser) {
      router.push("/");
    } else {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleGenerate = () => {
    if (!role || !duration) {
      alert("Please enter role and duration");
      return;
    }

    router.push(`/output?role=${role}&duration=${duration}`);ss
  };

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    router.push("/");
  };

  return (
    <div style={styles.bg}>
      {/* PROFILE */}
      <div style={styles.profileBox}>
        <button
          style={styles.iconBtn}
          onClick={() => setOpenProfile(!openProfile)}
        >
          👤
        </button>

        {openProfile && (
          <div style={styles.dropdown}>
            <h4 style={styles.heading}>My Profile</h4>

            <div style={styles.info}>
              <p style={styles.label}>Name</p>
              <p style={styles.value}>{user?.name}</p>
            </div>

            <div style={styles.info}>
              <p style={styles.label}>Email</p>
              <p style={styles.value}>{user?.email}</p>
            </div>

            <button style={styles.logout} onClick={handleLogout}>
              Logout
            </button>
          </div>
        )}
      </div>

      {/* MAIN CARD */}
      <div style={styles.card}>
        <h1 style={styles.title}>🚀 CurricuForge</h1>
        <p style={styles.subtitle}>
          Build your personalized AI learning roadmap
        </p>

        {/* ROLE DROPDOWN ✅ FIXED */}
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          style={styles.select}
        >
          <option style={styles.option} value="">Select Role</option>
          <option style={styles.option} value="web developer">Web Developer</option>
          <option style={styles.option} value="python developer">Python Developer</option>
          <option style={styles.option} value="data analyst">Data Analyst</option>
          <option style={styles.option} value="java developer">Java Developer</option>
          <option style={styles.option} value="software engineer">Software Engineer</option>
          <option style={styles.option} value="frontend developer">Frontend Developer</option>
          <option style={styles.option} value="backend developer">Backend Developer</option>
          <option style={styles.option} value="full stack developer">Full Stack Developer</option>
          <option style={styles.option} value="ai engineer">AI Engineer</option>
          <option style={styles.option} value="devops engineer">DevOps Engineer</option>
        </select>

        {/* DURATION */}
        <input
          style={styles.input}
          type="text"
          placeholder="Enter Duration (e.g. 3 months)"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
        />

        <button style={styles.button} onClick={handleGenerate}>
          Generate Curriculum
        </button>
      </div>
    </div>
  );
}

const styles = {
  bg: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg, #1e1e2f, #2b2b45)",
    fontFamily: "Arial",
    position: "relative",
  },

  profileBox: {
    position: "absolute",
    top: "20px",
    right: "30px",
  },

  iconBtn: {
    width: "42px",
    height: "42px",
    borderRadius: "50%",
    border: "1px solid rgba(0,245,212,0.6)",
    background: "rgba(0,245,212,0.15)",
    color: "#00f5d4",
    fontSize: "18px",
    cursor: "pointer",
  },

  dropdown: {
    marginTop: "10px",
    width: "220px",
    background: "white",
    borderRadius: "10px",
    padding: "12px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.25)",
  },

  heading: {
    margin: "0 0 10px 0",
    fontSize: "14px",
    fontWeight: "bold",
  },

  info: {
    marginBottom: "10px",
  },

  label: {
    fontSize: "11px",
    color: "#777",
    margin: 0,
  },

  value: {
    fontSize: "13px",
    fontWeight: "bold",
    margin: "2px 0 0 0",
  },

  logout: {
    width: "100%",
    padding: "8px",
    borderRadius: "6px",
    border: "none",
    background: "#ff4d4d",
    color: "white",
    fontWeight: "bold",
    cursor: "pointer",
  },

  card: {
    width: "380px",
    padding: "35px",
    borderRadius: "16px",
    background: "rgba(255,255,255,0.08)",
    backdropFilter: "blur(20px)",
    boxShadow: "0 10px 40px rgba(0,0,0,0.4)",
    display: "flex",
    flexDirection: "column",
    gap: "15px",
    color: "white",
  },

  title: {
    textAlign: "center",
    fontSize: "32px",
    color: "#00f5d4",
    fontWeight: "bold",
  },

  subtitle: {
    textAlign: "center",
    fontSize: "13px",
    opacity: 0.8,
  },

  // ✅ UPDATED INPUT
  input: {
    padding: "12px",
    borderRadius: "10px",
    border: "1px solid rgba(255,255,255,0.3)",
    outline: "none",
    fontSize: "14px",
    background: "rgba(0, 0, 0, 0.4)",
    color: "white",
  },

  // ✅ NEW SELECT STYLE (FIXED)
  select: {
    padding: "12px",
    borderRadius: "10px",
    border: "1px solid rgba(255,255,255,0.3)",
    outline: "none",
    fontSize: "14px",
    background: "#1f1f2e",
    color: "white",
    cursor: "pointer",
    appearance: "menulist",
  },

  // ✅ OPTION FIX
  option: {
    backgroundColor: "#1f1f2e",
    color: "white",
  },

  button: {
    padding: "12px",
    borderRadius: "10px",
    border: "none",
    background: "linear-gradient(90deg, #00f5d4, #00bbf9)",
    color: "#000",
    fontWeight: "bold",
    cursor: "pointer",
  },
};
