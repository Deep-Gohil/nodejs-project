import navbar from "../components/navbar.js";
document.getElementById("navbar").innerHTML = navbar();

// Parse `isVerified` from cookies
let isVerified = Cookies.get("isVerified");

console.log("isVerified:", isVerified);

if (!isVerified) {  // Check if `isVerified` is not true
    document.getElementById("alert").innerHTML = `
        <div class="alert alert-warning" role="alert">
            Please verify your email to access all features!
        </div>
    `;
}
