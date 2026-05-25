"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();

  const [isLogin, setIsLogin] = useState(true);

  // Login fields
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Register fields
  const [name, setName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");

  useEffect(() => {
    const users = JSON.parse(localStorage.getItem("users")) || [];
    if (users.length === 0) {
      setIsLogin(false);
    } else {
      setIsLogin(true);
    }
  }, []);

  // ✅ LOGIN
  const handleLogin = (e) => {
    e.preventDefault();

    const users = JSON.parse(localStorage.getItem("users")) || [];

    const userExists = users.find(
      (u) => u.email === loginEmail && u.password === loginPassword
    );

    if (userExists) {
      localStorage.setItem("currentUser", JSON.stringify(userExists));
      router.push("/dashboard");
    } else {
      alert("User not registered or wrong credentials!");
    }
  };

  // ✅ REGISTER (UPDATED)
  const handleRegister = (e) => {
    e.preventDefault();

    let users = JSON.parse(localStorage.getItem("users")) || [];

    const alreadyExists = users.find((u) => u.email === regEmail);

    // 🔴 If already registered
    if (alreadyExists) {
      alert("Already registered! Please login.");
      setIsLogin(true);
      return;
    }

    const newUser = {
      name,
      email: regEmail,
      password: regPassword,
    };

    users.push(newUser);

    localStorage.setItem("users", JSON.stringify(users));

    // ✅ AFTER REGISTER → DO NOT LOGIN DIRECTLY
    alert("Registered successfully! Please login.");

    // Clear fields
    setName("");
    setRegEmail("");
    setRegPassword("");

    // Switch to login page
    setIsLogin(true);
  };

  return (
    <div style={styles.container}>
      <div style={styles.box}>
        <h1 style={styles.title}>
          {isLogin ? "Login" : "Register"}
        </h1>

        {isLogin ? (
          <form onSubmit={handleLogin} style={styles.form}>
            <input
              type="email"
              placeholder="Email"
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
              style={styles.input}
              required
            />

            <input
              type="password"
              placeholder="Password"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
              style={styles.input}
              required
            />

            <button type="submit" style={styles.button}>
              Login
            </button>
          </form>
        ) : (
          <form onSubmit={handleRegister} style={styles.form}>
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={styles.input}
              required
            />

            <input
              type="email"
              placeholder="Email"
              value={regEmail}
              onChange={(e) => setRegEmail(e.target.value)}
              style={styles.input}
              required
            />

            <input
              type="password"
              placeholder="Password"
              value={regPassword}
              onChange={(e) => setRegPassword(e.target.value)}
              style={styles.input}
              required
            />

            <button type="submit" style={styles.button}>
              Register
            </button>
          </form>
        )}

        <p style={styles.switchText}>
          {isLogin ? "New user?" : "Already registered?"}{" "}
          <span
            onClick={() => setIsLogin(!isLogin)}
            style={styles.link}
          >
            {isLogin ? "Register" : "Login"}
          </span>
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#f4f6f8",
  },
  box: {
    width: "350px",
    padding: "30px",
    background: "white",
    borderRadius: "10px",
    boxShadow: "0 0 10px rgba(0,0,0,0.1)",
    textAlign: "center",
  },
  title: {
    marginBottom: "20px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  input: {
    padding: "10px",
    borderRadius: "5px",
    border: "1px solid #ccc",
  },
  button: {
    padding: "10px",
    background: "#0070f3",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  switchText: {
    marginTop: "15px",
    fontSize: "14px",
  },
  link: {
    color: "blue",
    cursor: "pointer",
    fontWeight: "bold",
  },
};
