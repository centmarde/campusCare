import { supabase } from '../main'

const form_login = document.getElementById("form_login");

document.body.addEventListener("click", function (event) {
    if (event.target.id === "btn_create") {
      register(event);
    }
  });

  form_login.onsubmit = async (e) => {
    e.preventDefault();

    btn_create.innerHTML = `<div class="spinner-border text-light-sm me-2" role="status"></div><span></span>`;
  
    const formData = new FormData(form_login);
  
    let { data, error } = await supabase.auth.signInWithPassword({
      email: formData.get("email"),
      password: formData.get("password"),
    });
  
    let session = data.session;
    let user = data.user;
  
    console.log(user);
  
    if (session != null) {
     
      localStorage.setItem("access_token", session.access_token);
      localStorage.setItem("refresh_token", session.refresh_token);
  
      localStorage.setItem("auth_id", user?.id);
  
      let { data: userInformation, error: userInfoError } = await supabase
        .from("user_information")
        .select("*")
        .eq("user_id", localStorage.getItem("auth_id"));
  
      localStorage.setItem("user_id", userInformation[0].id);
      console.log(userInformation[0].id);
  
      /* role system if implemented */
      let isAdmin = userInformation[0].is_admin;
  
      if (isAdmin === true) { 
          alert("Welcome, Admin!");
          window.location.href = 'admin_home.html'; 
      } else {
          alert("Greetings!");
          window.location.href = 'home.html'; 
      }
    } else {
        alert("Error Please Try again or check your password");
        console.log(error);
    }
    btn_create.innerHTML = "Sign In";
    form_login.reset();
  };
  

const register = async (e) => {
    e.preventDefault();
    btn_create.innerHTML = `<div class="spinner-border text-light-sm me-2" role="status"></div><span></span>`;

   
    const formData = new FormData(form_register);
    const password = formData.get("password_reg");
    const confirmPassword = formData.get("password_confirm");

    if (formData.get("password_reg") == formData.get("password_confirm")){

        //supabase log-in
        const { data, error } = await supabase.auth.signUp({
            email: formData.get("email_reg"),
            password: formData.get("password_reg"),
        });

        let user_id = data?.user?.id;
        if (user_id != null) {

            //getting the info
            const { data, error } = await supabase
                .from('user_information')
                .insert([
                    {
                       firstname: formData.get("firstname"),lastname: formData.get("lastname"),student_id_no: formData.get("student_id_no"),
                        user_id:user_id, 
                    }
                ])
                .select()

                alert("You have been Registered!");

            //if success registration condition
            if (error == null) {
                alert("Register Successfully please verify your email");
                console.log(data);
                window.location.reload();
            }
            else {
                 console.log(error);
                alert("error");
                console.log(error);
            }
            form_register.reset();
            //button loading after succes registration
            document.querySelector("#form_register button").disabled = false;
            document.querySelector("#form_register button").innerHTML = "Register";
        }
    }else {
        //button loading after password dont match
        errorNotification("Password not match", 10);
        document.querySelector("#form_register button").disabled = false;
        document.querySelector("#form_register button").innerHTML = "Register";
        btn_create.innerHTML = "Create Account";
    }
}

//modal Toggler
$(".message a").click(function () {
    $("form").animate({ height: "toggle", opacity: "toggle" }, "slow");
  });