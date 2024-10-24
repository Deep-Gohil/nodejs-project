import userApi from "../api/api.js";
import getValue from "../components/getValue.js";
import navbar from "../components/navbar.js";
document.getElementById("navbar").innerHTML = navbar()

const handleLogin = (e) =>{
    e.preventDefault();

    let user = {
        email: getValue("#email"),
        password: getValue("#password"),
    }

    if(!user.email || !user.password){
        alert("Please fill in all fields");
        return;
    }

    userApi.login(user)
}

document.getElementById("form").addEventListener("submit",handleLogin);