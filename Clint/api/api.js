const baseUrl = "http://localhost:8090";

const userApi = {
  signup: async (user) => {
    try {
      let req = await fetch(`${baseUrl}/user/signup`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(user),
      });

      let res = await req.json();
      console.log(res.token);
      if (res.token) {
        let a = await Cookies.set("token", res.token, { expires: 7 });
        a
          ? (window.location.href = "http://127.0.0.1:5501/pages/login.html")
          : console.log("Not set");
      } else {
        console.error("Signup failed", res);
      }
    } catch (error) {
      console.error("Error during signup:", error.message);
    }
  },

  login: async (user) => {
    try {
      let req = await fetch(`${baseUrl}/user/login`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(user),
      });

      let res = await req.json();
      if (res.token) {
        // Store the token in cookies for 7 days
        Cookies.set("token", res.token, { expires: 7 });
        console.log("Login successful, token stored in cookies", res);
        window.location.href = "/";
      } else {
        console.error("Login failed", res);
      }
    } catch (error) {
      console.error("Error during login:", error.message);
    }
  },
};

export default userApi;
