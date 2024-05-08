import { supabase } from "../main";

const itemsImageUrl =
  "https://fprynlwueelbysitqaii.supabase.co/storage/v1/object/public/profilePicture/";
const userId = localStorage.getItem("user_id");
console.log(userId);

getDatas();

async function getDatas() {
  let { data: post, error } = await supabase
    .from("post")
    .select("*,user_information(*)");
  /*  .eq("user_id",userId) */

  post.sort(() => Math.random() - 0.5);
  let container = "";

  post.forEach((data) => {
    const imagepath = data.user_information.image_path;
    const codename = data.user_information.code_name;

    let deleteButton = "";
    if (userId == data.user_information.id) {
      deleteButton = `<button data-id="${data.id}" id="delete_btn" type="button" class="btn btn-outline-light">Delete</button>`;
    }

    container += `
      <div class="m-3 p-3" style="border-radius: 10px; background: rgba(0, 0, 0, 0.5);" data-id="${
        data.id
      }">
        <div class="card d-flex align-items-center flex-row w-100" style="border-radius: 10px; background: rgba(255, 255, 255, 0.5);">
          <img
            src="${itemsImageUrl + imagepath}"
            class="block mx-2 my-2 border border-black border-2 rounded-circle me-2"
            style="border-radius: 50%; width: 50px; height: 50px"
            alt=""
          />
          <h5 class="card-title px-1">${data.title}</h5>
          <div class="row"></div>
        </div>
        <div class="card-body">
          <p class="text-light card-text d-grid  mt-3 ">
            <cite class="text-light card-subtitle mb-2" >
              By: ${codename}
            </cite>
            ${data.body}
          </p>
          <div class="row d-flex justify-content-center">
            <img
            src="${itemsImageUrl + data.image_path}"
              style="width: 400px; height: 200px"
            />
          </div>
          <div class="mt-2">
            <!-- Button trigger modal -->
            <button type="button" class="btn btn-outline-light" data-bs-toggle="modal" data-bs-target="#comment1">
              Comment
            </button>
            ${deleteButton}
            <!-- Modal -->
            <div class="modal fade" id="comment1" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="commentLabel1" aria-hidden="true">
              <div class="modal-dialog">
                <div class="modal-content">
                  <div class="modal-header">
                    <h1 class="modal-title fs-5" id="commentLabel1">Comments</h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                  </div>
                  <div class="modal-body">
                    <div class="card card-body">
                      <p class="card-text ">
                        <img
                          src="assets/face.jpg"
                          class="card-img-top"
                          style="border-radius: 50%; width: 20px; height: 20px"
                          alt=""
                        />
                        <h6 class="card-subtitle text-body-secondary" style="overflow-y: auto">
                          By Admin
                        </h6>
                        Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et 
                      </p>
                    </div>
                    <div class="card card-body">
                      <p class="card-text ">
                        <img
                          src="assets/face.jpg"
                          class="card-img-top"
                          style="border-radius: 50%; width: 20px; height: 20px"
                          alt=""
                        />
                        <h6 class="card-subtitle text-body-secondary" style="overflow-y: auto">
                          By Admin
                        </h6>
                        Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et
                      </p>
                    </div>
                  </div>
                  <div class="modal-footer"> 
                    <input
                            type="text"
                            name="text"
                            value=""
                            class="w-100 p-3"
                            placeholder="Write a comment..."
                            style="height: 50px; border: 2px solid #ccc; border-radius: 10px;"
                          />
                    <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">Close</button>
                    <button type="button" class="btn btn-outline-secondary">Add Comment</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  });
  document.getElementById("container").innerHTML = container;
}

async function addData() {
  const formData = new FormData(form_post);
  const fileInput = document.getElementById("uploadPhotoBtn");
  const file = fileInput.files[0];

  if (file) {
    const filePath = `postPicture/${file.name}`;
    await supabase.storage.from("public").upload(filePath, file);
    formData.set("image_path", filePath);
  }

  const { data, error } = await supabase
    .from("post")
    .insert([
      {
        title: formData.get("title"),
        body: formData.get("body"),
        user_id: userId,
        image_path: formData.get("image_path"),
      },
    ])
    .select();

  if (error) {
    alert("Something wrong happened. Cannot add item.");
    console.log(error);
  } else {
    alert("Post Successfully Added!");
    getDatas();
    window.location.reload();
  }
}

const post_btn = document.getElementById("post_btn");
if (post_btn) {
  post_btn.onclick = () => {
    // Disable the button and show loading spinner
    post_btn.disabled = true;
    post_btn.innerHTML = `<div class="spinner-grow spinner-grow-sm" role="status">
    <span class="visually-hidden">Loading...</span>
  </div><div class="spinner-grow spinner-grow-sm" role="status">
  <span class="visually-hidden">Loading...</span>
</div><div class="spinner-grow spinner-grow-sm" role="status">
<span class="visually-hidden">Loading...</span>
</div>`;

    addData()
      .then(() => {
        // Re-enable the button and change the text
        post_btn.disabled = false;
        post_btn.innerHTML = "Submit";
      })
      .catch((error) => {
        console.error("Add post failed:", error);
        // Re-enable the button in case of error
        post_btn.disabled = false;
        post_btn.innerHTML = "Submit";
      });
  };
}

document.body.addEventListener("click", function (event) {
  if (event.target.id === "post_btn") {
    addData(event);
  } else if (event.target.id === "delete_btn") {
    const dataId = event.target.dataset.id;
    deletePost(event, dataId);
  }
});

async function deletePost(event, id) {
  const isConfirmed = window.confirm("Are you sure you want to delete Post?");

  if (!isConfirmed) {
    return;
  }

  try {
    const { error } = await supabase.from("post").delete().eq("id", id);
    if (error) {
      throw error;
    }
    alert("Post Successfully Deleted!");
    window.location.reload();
  } catch (error) {
    alert("Error Something's Wrong!");
    console.error(error);
    window.location.reload();
  }
}
