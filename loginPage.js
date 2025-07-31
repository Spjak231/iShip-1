document.addEventListener("DOMContentLoaded", function () {
    const container = document.querySelector(".container");

    // Handle ?form= login/register in URL
    const urlParams = new URLSearchParams(window.location.search);
    const formType = urlParams.get("form");
    if (formType === "login") {
        container.classList.add("active");
    } else {
        container.classList.remove("active");
    }

    // Attach click events to all register/login buttons
    document.querySelectorAll(".register-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            container.classList.add("active");
            window.history.replaceState(null, "", "?form=login");
        });
    });

    document.querySelectorAll(".login-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            container.classList.remove("active");
            window.history.replaceState(null, "", "?form=register");
        });
    });

    // REGISTER functionality
    document.querySelector(".form-box.register form").addEventListener("submit", function (e) {
        e.preventDefault();
        const username = document.getElementById("register-username").value.trim();
        const email = document.getElementById("register-email").value.trim();
        const password = document.getElementById("register-password").value.trim();

        if (username && email && password) {
            localStorage.setItem("Username", username);
            localStorage.setItem("Email", email);
            localStorage.setItem("Password", password);
            localStorage.setItem("isLoggedIn", "true");

            swal("Registered!", "Now you can log in.", "success").then(() => {
                window.location.href = "./index.html";
            });
        } else {
            swal("Error", "Please fill in all fields", "error");
        }
    });

    // LOGIN functionality
    document.querySelector(".form-box.login form").addEventListener("submit", function (e) {
        e.preventDefault();
        const username = document.getElementById("login-username").value.trim();
        const password = document.getElementById("login-password").value.trim();

        const storedUsername = localStorage.getItem("Username");
        const storedPassword = localStorage.getItem("Password");

        if (!username || !password) {
            swal("Missing", "Username and password are required.", "warning");
        } else if (username === storedUsername && password === storedPassword) {
            localStorage.setItem("isLoggedIn", "true");
            swal("Login Success", `Welcome back, ${username}!`, "success").then(() => {
                window.location.href = "./index.html";
            });
        } else {
            swal("Failed", "Incorrect username or password.", "error");
        }
    });

    // For index.html auth buttons visibility
    const authButtons = document.getElementById("authButtons");
    const profileIcon = document.getElementById("profileIcon");

    if (authButtons && profileIcon) {
        const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
        if (isLoggedIn) {
            authButtons.classList.add("hidden");
            profileIcon.classList.remove("hidden");
        } else {
            authButtons.classList.remove("hidden");
            profileIcon.classList.add("hidden");
        }
    }
});
