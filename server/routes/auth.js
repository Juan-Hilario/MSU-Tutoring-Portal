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

    res.status(200).json({ user: data.user, session: data.session });
});

module.exports = router;
