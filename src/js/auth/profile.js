import { supabase } from "../main";
import * as bootstrap from "bootstrap";

const itemsImageUrl =
  "https://fprynlwueelbysitqaii.supabase.co/storage/v1/object/public/profilePicture/";
const userId = localStorage.getItem("user_id");
console.log(userId);
const postImageUrl =
  "https://fprynlwueelbysitqaii.supabase.co/storage/v1/object/public/postPicture/";
const imagePostPath = "./postPicture/";
const imageUrl = itemsImageUrl + imagePostPath;
console.log(imageUrl);
getDatas();
sessionStorage.setItem("user_program", "user_program");
sessionStorage.setItem("code_name", "code_name");

document.addEventListener("DOMContentLoaded", function () {
  const userProgram = sessionStorage.getItem("user_program");
  const codeName = sessionStorage.getItem("code_name");
  document.getElementById("programContainer").innerText = userProgram;
  document.getElementById("codenameContainer").innerText = codeName;

  document
    .getElementById("information_btn")
    .addEventListener("click", function () {
      const newProgram = document.getElementById("user_program").value;
      const newCodename = document.getElementById("codename").value;
      document.getElementById("programContainer").innerText = newProgram;
      document.getElementById("codenameContainer").innerText = newCodename;
      // Store the updated values in session storage
      sessionStorage.setItem("user_program", newProgram);
      sessionStorage.setItem("code_name", newCodename);
    });

  getDatas();
});

document.body.addEventListener("click", function (event) {
  if (event.target.id === "saveImage") {
    saveImage(event);
  } else if (event.target.id === "delete_btn") {
    deletePost(event);
  } else if (event.target.id === "information_btn") {
    editProfile(event);
  } else if (event.target.id === "post_btn") {
    addData(event);
  }
});

async function getDatas(searchTerm = "") {
  try {
    // Fetch user information
    let { data: user_information, error: userError } = await supabase
      .from("user_information")
      .select("*, user_program, code_name")
      .eq("id", userId);
    let { data: post, error: postError } = await supabase
      .from("post")
      .select("*,user_information(*)")
      .eq("user_id", userId);

    // Fetch announcement
    let { data: announcements, error: announcementError } = await supabase
      .from("notice")
      .select("*");

    // Check for errors
    if (userError || postError || announcementError) {
      throw userError || postError || announcementError;
    }

    // Update session storage with user program and code name
    sessionStorage.setItem("user_program", user_information[0].user_program);
    sessionStorage.setItem("code_name", user_information[0].code_name);

    // Update local storage with posts
    localStorage.setItem("posts", JSON.stringify(post));

    let imageContainer = "";
    let nameContainer = "";
    let idContainer = "";
    let container = "";

    // Update UI with user information
    user_information.forEach((data) => {
      imageContainer += `<div  data-id="${data.image_path}" > <img
                          src="${itemsImageUrl + data.image_path}"
                        class="block my-2 border border-dark border-2 rounded-circle"
                        alt="image profile" style="border-radius: 50%; width: 125px; height: 125px"
                      /></div>`;
      nameContainer += `<h1>${data.firstname}</h1>`;
      idContainer += `<p>${data.student_id_no}</p>`;
      programContainer.innerText = data.user_program;
      codenameContainer.innerText = data.code_name;
    });

    // Update UI with announcements
    announcements.forEach((data) => {
      document.getElementById("announcementTitle1").innerText =
        data.announcement_title;
      document.getElementById("announcementBody1").innerText =
        data.announcement;
    });

    if (searchTerm) {
      post = post.filter((p) =>
        p.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Update UI with posts
    post.forEach((data) => {
      const imagepost = data.image_post;
      let postImage = "";
      if (imagepost) {
        postImage = `<img src="${
          postImageUrl + imagepost
        }" style="width: 400px; height: 200px" />`;
      }
      let deleteButton = `<button type="button" class="btn btn-outline-light" id="delete_btn" data-id="${data.id}">Delete</button>`;
      container += `
      <div class="m-3 p-3" style="border-radius: 10px; background: rgba(0, 0, 0, 0.5); color: black" >
        <div class="card d-flex align-items-center flex-row w-100" style="border-radius: 10px; background: rgba(255, 255, 255, 0.5);" data-id="${
          data.image_path
        }">
          <img
            src="${itemsImageUrl + user_information[0].image_path}"
            class="block mx-2 my-2 border border-black border-2 rounded-circle me-2"
            style="border-radius: 50%; width: 50px; height: 50px"
            alt=""
          />
        <h5 class="card-title" style="color: black">${data.title}</h5>
      </div>
      <div class="card-body">
          <p class="text-light card-text d-grid  mt-3 ">
            <cite class="text-light card-subtitle mb-2" >
              By: ${user_information[0].code_name}
            </cite>
            ${data.body}
          </p>
          <div class="row d-flex justify-content-center">
                    ${postImage}
                </div>
          <div class="mt-2">
            <!-- Button trigger modal -->
            <button type="button" class="btn btn-outline-light" data-bs-toggle="modal" data-bs-target="#comment1">
              Comment
            </button>
            ${deleteButton}
            <!-- Modal -->
            <div class="modal fade" id="comment1" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="commentLabel1" aria-hidden="true">
              <!-- Modal content -->
            </div>
          </div>
        </div>
    </div>`;
    });

    // Update UI containers with updated data
    document.getElementById("imageContainer").innerHTML = imageContainer;
    document.getElementById("nameContainer").innerHTML = nameContainer;
    document.getElementById("idContainer").innerHTML = idContainer;
    document.getElementById("container").innerHTML = container;
  } catch (error) {
    console.error("Error fetching data:", error);
    alert("Something went wrong. Please try again later.");
  }
}

document.getElementById("searchInput").addEventListener("input", function () {
  const searchTerm = this.value.trim();
  getDatas(searchTerm);
});

const deletePost = async (e) => {
  const id = e.target.getAttribute("data-id");
  console.log(id);

  const isConfirmed = window.confirm("Are you sure you want to delete post?");

  if (!isConfirmed) {
    return;
  }

  try {
    const { error } = await supabase.from("post").delete().eq("id", id);
    if (error) {
      throw error;
    }
    alert("Post Successfully Deleted!");
    getDatas();
  } catch (error) {
    console.error("Error deleting post:", error);
    alert("Something went wrong. Please try again later.");
  }
};

async function editAction() {
  try {
    let { data: user_information, error } = await supabase
      .from("user_information")
      .select("*")
      .eq("id", userId);

    if (error) {
      throw error;
    }

    let for_update_id = user_information[0].id;

    document.getElementById("codename").value = user_information[0].code_name;
    document.getElementById("firstname").value = user_information[0].firstname;
    document.getElementById("lastname").value = user_information[0].lastname;
    document.getElementById("student_id_no").value =
      user_information[0].student_id_no;
    document.getElementById("user_program").value =
      user_information[0].user_program;
  } catch (error) {
    console.error("Error fetching user information:", error);
    alert("Something went wrong. Please try again later.");
  }
}

async function saveImage(event) {
  event.preventDefault(); // Prevent the form from submitting normally

  // Get the file input element
  const imageUpload = document.getElementById("imageUpload");
  const file = imageUpload.files[0];

  if (!file) {
    alert("Please select an image file.");
    return;
  }

  // Read the file as a data URL
  const reader = new FileReader();
  reader.onload = async function (e) {
    const imageDataUrl = e.target.result;

    // Make an API call to update the user's profile picture
    try {
      // Upload the image to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("profilePicture")
        .upload("profilePicture/" + file.name, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data, error } = await supabase
        .from("user_information")
        .update({
          image_path: "profilePicture/" + file.name, // Use the original file name as the image path
          image_data: imageDataUrl.split(",")[1], // Use the base64 data after the comma
        })
        .eq("id", userId);

      if (error) {
        throw error;
      }

      // Update the UI to reflect the changes (you need to have an <img> tag with id="imageContainer")
      document.getElementById(
        "imageContainer"
      ).innerHTML = `<img src="${imageDataUrl}" class="img-fluid" alt="Profile Picture">`;

      // Close the modal
      const modal = document.getElementById("editPicture");
      const modalInstance = bootstrap.Modal.getInstance(modal);
      modalInstance.hide();

      alert("Profile picture updated successfully!");
    } catch (error) {
      console.error("Error updating profile picture:", error);
      alert("Failed to update profile picture. Please try again later.");
    }
  };
  reader.readAsDataURL(file);
}

async function editProfile(event) {
  event.preventDefault();

  const codename = document.getElementById("codename").value;
  const firstname = document.getElementById("firstname").value;
  const lastname = document.getElementById("lastname").value;
  const studentIdNo = document.getElementById("student_id_no").value;
  const userProgram = document.getElementById("user_program").value;

  try {
    const { error } = await supabase
      .from("user_information")
      .update({
        code_name: codename,
        firstname,
        lastname,
        student_id_no: studentIdNo,
        user_program: userProgram,
      })
      .eq("id", userId);

    if (error) {
      throw error;
    }

    document.getElementById(
      "nameContainer"
    ).innerHTML = `<h1>${firstname} ${lastname}</h1>`;
    document.getElementById("idContainer").innerHTML = `<p>${studentIdNo}</p>`;

    const modal = document.getElementById("editProfile");
    const modalInstance = bootstrap.Modal.getInstance(modal);
    modalInstance.hide();

    alert("Profile updated successfully!");
  } catch (error) {
    console.error("Error updating user information:", error);
    alert("Failed to update profile. Please try again later.");
  }
}

async function addData() {
  const formData = new FormData(form_post);
  const fileInput = document.getElementById("uploadPhotoBtn");
  const file = fileInput.files[0];
  let imagePath = ""; // Define imagePath variable

  if (file) {
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("postPicture")
      .upload("postPicture/" + file.name, file);

    if (uploadError) {
      alert("Error uploading post picture.");
      console.error("Upload error:", uploadError.message);
      return;
    }

    // Get the file path after uploading
    imagePath = "postPicture/" + file.name;

    // Update the 'post' table with the image data
    const { data: updateData, updateError } = await supabase
      .from("post")
      .update({ image_post: imagePath })
      .eq("id", userId);

    if (updateError) {
      alert("Error updating post with image data.");
      console.error("Update error:", updateError.message);
      return;
    }
  }

  // Insert the post data with the image path
  const { data: postData, insertError } = await supabase
    .from("post")
    .insert([
      {
        title: formData.get("title"),
        body: formData.get("body"),
        image_post: imagePath, // Use the image path here
        user_id: userId,
      },
    ])
    .select();

  if (insertError) {
    alert("Error adding post.");
    console.error("Insert error:", insertError.message);
    return;
  }

  alert("Post Successfully Added!");
  getDatas();
  window.location.reload();
}
