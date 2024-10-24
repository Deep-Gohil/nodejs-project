import userApi from "../api/api.js";
import getValue from "../components/getValue.js";
import navbar from "../components/navbar.js";
document.getElementById("navbar").innerHTML = navbar();

const handleSubmit = (e)=>{
    e.preventDefault();

    let user = {
        username:getValue("#name"),
        email: getValue("#email"),
        password: getValue("#password")
    }
    console.log(user);
    
    if(!user.username || !user.email || !user.password){
        alert("All fields are required");
        return; 
    }
    // userApi.signup(user);   
    userApi.signup(user); 
    
    
}

document.getElementById("form").addEventListener("submit",handleSubmit)