function setRouter() {
    const path = window.location.pathname;
    const isLoggedIn = localStorage.getItem("access_token") !== null;
    const userRole = localStorage.getItem("role");
    console.log(userRole);
    switch (path) {
      // Pages accessible when not logged in
      case "/":
      case "/index.html":
      case "/login.html":
        if (isLoggedIn) {
          window.location.pathname = "/home.html";
        }
        break;
  
      // Pages accessible only when logged in
      case "/home.html":
      case "/profile.html":
      case "/menu.html":
        if (!isLoggedIn) {
          window.location.pathname = "/login.html";
        }
        break;
  
      // Pages accessible only when logged in as admin
      case "/dashboard.html":
        if (!isLoggedIn) {
          window.location.pathname = "/index.html";
        } else if (userRole !== "admin") {
          window.location.pathname = "/home.html";
        }
        break;
  
      // Add more cases if there are more pages
  
      default:
        break;
    }
  }
  
  export { setRouter };
  