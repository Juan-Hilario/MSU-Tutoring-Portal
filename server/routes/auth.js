const express = require("express");
const router = express.Router();
const supabase = require("../supabaseClient");

// Sign Up
router.post("/signup", async (req, res) => {
  const { email, password, fname, lname } = req.body;
  const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
    email,
    password,
    email_confirm: false,
  });

  if (signUpError) {
    console.log("Signup Error:", signUpError.message);
    return res.status(400).json({ error: signUpError.message });
  }

  const userId = signUpData.user.id;
  console.log("User created Id:", userId);

  // Adds Account to profiles
  const { error: profileError } = await supabase
    .from("Profiles")
    .insert([{ id: userId, fname, lname }]);

  if (profileError) {
    console.log("Profile Insert Error:", profileError.message);
    return res.status(500).json({ error: profileError.message });
  }

  res.status(201).json({ message: "User created sucessfully", userId });
});

//Log In
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return res.status(401).json({ error: error.message });
  }

  const token = data.session.access_token;
  const userId = data.user.id;

  res.cookie("access_token", token, {
    httpOnly: true,
    secure: false,
    sameSite: "Strict",
    maxAge: 1000 * 60 * 60 * 24,
  });

  const { data: userRole, error: userRoleError } = await supabase
    .from("Profiles")
    .select("role")
    .eq("id", userId)
    .single();

  if (userRoleError)
    return res.status(500).json({ error: "User Role not found" });
  res.json({
    user: { id: data.user.id, email: data.user.email },
    role: userRole.role,
  });
});

// SignOut
router.post("/api/logout", async (req, res) => {
  const accessToken = req.cookies.access_token;
  if (accessToken) {
    const { error } = await supabase.auth.admin.signOut(accessToken);
    if (error) {
      console.error("Error revoking session: ", error.message);
      return res.status(500).json({ error: error.message });
    }
  }

  res.clearCookie("access-token", {
    httpOnly: true,
    secure: false,
    sameSite: "Strict",
  });
  res.status(200).json({ message: "Logged out" });
});

// Retrieves User information
router.get("/api/me", async (req, res) => {
  const token = req.cookies.access_token;
  if (!token) return res.status(401).json({ error: "Unauthorized" });

  const { data, error } = await supabase.auth.getUser(token);
  if (error) return res.status(401).json({ error: "Invalid token" });

  const userId = data.user.id;

  const { data: userRole, error: userRoleError } = await supabase
    .from("Profiles")
    .select("role, fname, lname")
    .eq("id", userId)
    .single();

  if (userRoleError)
    return res.status(500).json({ error: "User Role not found" });

  console.log("email: ", data.user.email);

  res.json({
    user: {
      fname: userRole.fname,
      lname: userRole.lname,
      id: data.user.id,
      email: data.user.email,
    },
    role: userRole.role,
  });
});

module.exports = router;
