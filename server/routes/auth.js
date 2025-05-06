const express = require("express");
const router = express.Router();
const supabase = require("../supabaseClient");
const multer = require("multer");
const FormData = require("form-data");
const axios = require("axios");
const path = require("path");
const fs = require("fs");

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
    .insert([{ id: userId, fname, lname, email }]);

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
    httponly: true,
    secure: false,
    samesite: "strict",
    maxage: 1000 * 60 * 60 * 24,
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
  // const accessToken = req.cookies.access_token;
  // if (accessToken) {
  //   const { error } = await supabase.auth.admin.signOut(accessToken);
  //   if (error) {
  //     console.error("Error revoking session: ", error.message);
  //     return res.status(500).json({ error: error.message });
  //   }
  // }

  res.clearCookie("access_token", {
    httpOnly: true,
    secure: false,
    sameSite: "Strict",
  });
  res.status(200).json({ message: "Logged out" });
});

// Retrieves User information From Token
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

// Retrieves User information with email FOR FACE AUTHORIZATION
router.get("/api/face/me", async (req, res) => {
  const email = req.query.email;

  const { data: user, error: userError } = await supabase
    .from("Profiles")
    .select("id, role, fname, lname")
    .eq("email", email)
    .single();

  if (userError || !user) {
    throw new Error("User not found with email:", email);
  }

  // console.log("email: ", data.user.email);

  res.json({
    user: {
      fname: user.fname,
      lname: user.lname,
      id: user.id,
      email: email,
    },
    role: user.role,
  });
});

const uploadsDir = path.resolve(__dirname, "../../uploads");
console.log("Uploads directory path:", uploadsDir);

const upload = multer({ dest: uploadsDir });

router.post("/api/face-auth", upload.single("photo"), async (req, res) => {
  const filePath = req.file.path;
  const email = req.body.email;

  let registeredPhotoPath;

  try {
    //Lookup user
    const { data: user, error: userError } = await supabase
      .from("Profiles")
      .select("id, email")
      .eq("email", email)
      .single();

    if (userError || !user) {
      throw new Error("User not found");
    }

    const userId = user.id;

    //Lookup TA face path
    const { data: ta, error: taError } = await supabase
      .from("TAs")
      .select("face")
      .eq("id", userId)
      .single();

    if (taError || !ta) {
      throw new Error("TA not found");
    }

    const facePath = ta.face;
    console.log(facePath);

    //Download registered photo
    const registeredPhotoRes = await fetch(facePath);

    if (!registeredPhotoRes.ok) {
      throw new Error("Failed to fetch registered face photo");
    }
    const buffer = await registeredPhotoRes.arrayBuffer();

    registeredPhotoPath = path.join(uploadsDir, `registered-${Date.now()}.jpg`);
    fs.writeFileSync(registeredPhotoPath, Buffer.from(buffer));

    //Prepare form to send both photos
    const form = new FormData();
    form.append("photo", fs.createReadStream(filePath), "photo.jpg");
    form.append(
      "registered",
      fs.createReadStream(registeredPhotoPath),
      "registered.jpg",
    );

    console.log("Form contents:", {
      photoPath: filePath,
      registeredPath: registeredPhotoPath,
      formHeaders: form.getHeaders(),
    });

    //POST to Flask server
    const flaskRes = await axios.post("http://127.0.0.1:5000/analyze", form, {
      headers: form.getHeaders(),
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
    });

    if (flaskRes.status !== 200) {
      throw new Error(`Flask server responded with status ${flaskRes.status}`);
    }

    const result = flaskRes.data;
    if (result.message) {
      res.json(result.message);
    } else {
      res.json(result["verified"]);
    }
  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: err.message || "An unexpected error occurred.",
    });
  } finally {
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    if (registeredPhotoPath && fs.existsSync(registeredPhotoPath))
      fs.unlinkSync(registeredPhotoPath);
  }
});

module.exports = router;
