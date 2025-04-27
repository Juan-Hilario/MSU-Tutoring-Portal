import { useState, useEffect, useRef } from "react";
import "../../styles/Login.css";
import { useNavigate } from "react-router-dom";
import { User } from "../../App";
import FaceCapture from "./FaceCapture";

interface LoginProps {
    setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

const Login: React.FC<LoginProps> = ({ setUser }) => {
    const [form, setForm] = useState({
        email: "",
        password: "",
    });

    const [fcWindow, setFCWindow] = useState(false);
    const fcWindowRef = useRef(null); // Reference for the outer window
    const fcWindowContentRef = useRef(null); // Reference for the content window

    const closeWindow = () => setFCWindow(false);

    const handleChange = (e) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await fetch("http://localhost:4000/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
                credentials: "include",
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || "Something went wrong");
            }
            const data = await res.json();

            setUser(data);

            // alert("Logged in " + data.user.email);
            navigate("/dashboard");
        } catch (err: any) {
            alert("Error: " + err.message);
        }
    };

    useEffect(() => {
        fetch("/api/me", {
            credentials: "include",
        })
            .then((res) => res.json())
            .then((data) => {
                // Check if user has role before proceeding
                if (data.role) {
                    setUser({
                        ...data.user,
                        role: data.role,
                    });
                }
            })
            .catch(() => setUser(null));
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            // Check if the click was outside the content area but within the window
            if (fcWindowRef.current && !fcWindowContentRef.current.contains(event.target)) {
                closeWindow();
            }
        };

        // Attach event listener to detect clicks
        document.addEventListener("mousedown", handleClickOutside);

        // Cleanup event listener
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <>
            {fcWindow && (
                <div className="fcWindow" ref={fcWindowRef}>
                    <div
                        className="fcWindowContent"
                        ref={fcWindowContentRef}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <FaceCapture />
                    </div>
                </div>
            )}

            <div style={{ display: "grid", backgroundColor: "" }}>
                <div className="loginTop">
                    <h1>Welcome to the Tutoring Portal</h1>
                    <h4>Supplemental Instruction</h4>
                </div>
                <div className="loginContainer">
                    <div className="loginSection">
                        <form onSubmit={handleSubmit} action="">
                            <h2>Login</h2>
                            <div className="loginInput">
                                <label htmlFor="email">Email</label>
                                <input
                                    onChange={handleChange}
                                    autoComplete="off"
                                    name="email"
                                    type="email"
                                />
                            </div>
                            <div className="loginInput">
                                <label htmlFor="password">Password</label>
                                <input
                                    onChange={handleChange}
                                    autoComplete="off"
                                    name="password"
                                    type="password"
                                />
                            </div>
                            <button className="formButton" type="submit">
                                Log in
                            </button>
                        </form>
                        <h3>OR</h3>
                        <button className="formButton" onClick={() => setFCWindow(!fcWindow)}>
                            FACE RECOGNITON
                        </button>
                    </div>
                </div>
                <div className="loginBottom">
                    <h4>
                        If you're a student <a href="/checkin">check in</a>{" "}
                    </h4>
                </div>
            </div>
        </>
    );
};

export default Login;
