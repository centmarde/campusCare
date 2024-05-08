import { doLogout, supabase } from "../main";

const btnLogout = document.getElementById("btn_logout");
if (btnLogout) {
  btnLogout.onclick = () => {
    // Disable the button and show loading spinner
    btnLogout.disabled = true;
    btnLogout.innerHTML = `<div class="spinner-border text-light-sm me-2" role="status" style="color: white"></div>`;

    doLogout()
      .then(() => {
        // Re-enable the button and change the text
        btnLogout.disabled = false;
        btnLogout.innerHTML = "Log-in";
      })
      .catch((error) => {
        console.error("Logout failed:", error);
        // Re-enable the button in case of error
        btnLogout.disabled = false;
        btnLogout.innerHTML = "Log-in";
      });
  };
}

const itemsImageUrl = "https://fprynlwueelbysitqaii.supabase.co/storage/v1/object/public/profilePicture/";
const userId = localStorage.getItem("user_id");

if (userId) {
  getDatas();
}

async function getDatas() {
  try {
    let { data: userInformation, error } = await supabase
      .from("user_information")
      .select("*")
      .eq("id", userId);

    if (error) {
      throw error;
    }

    let container = "";
    userInformation.forEach((data) => {
      container += `<div
        class="card d-flex align-items-center w-100"
        style="
          height: 135px;
          border-style: none;
          background: rgba(255, 255, 255, 0.5);
        "
      >
        <img
          src="${itemsImageUrl + data.image_path}"
          class="block my-2 border border-dark border-2 rounded-circle"
          style="border-radius: 50%; width: 10vh; height: 10vh"
          alt=""
        />
        <h5 style="color: white">${data.firstname + " " + data.lastname}</h5>
      </div>`;
    });

    document.getElementById("container").innerHTML = container;
  } catch (error) {
    console.error("Error fetching user information:", error);
    // Handle error (e.g., display an error message)
  }
}
