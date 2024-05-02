import { doLogout, supabase } from "../main";

const itemsImageUrl =
  "https://fprynlwueelbysitqaii.supabase.co/storage/v1/object/public/profilePicture/";
const userId = localStorage.getItem("user_id");

getDatas();

async function getDatas() {
  try {
    let { data: user_information, error: userError } = await supabase
      .from("user_information")
      .select("*")
      .eq("id", userId);

    let { data: post, error: postError } = await supabase
      .from("post")
      .select("*")
      .eq("user_id", userId);

    let imageContainer = "";
    let nameContainer = "";
    let idContainer = "";
    let container = "";

    user_information.forEach((data) => {
      imageContainer += `<div  data-id="${data.image_path}"> <img
                      src="${itemsImageUrl + data.image_path}"
                    class="block my-2 border border-dark border-2 rounded-circle"
                    alt="image profile" style="border-radius: 50%; width: 100px; height: 100px"
                  /></div>`;
      nameContainer += `<h1>${data.firstname}</h1>`;
      idContainer += `<p>${data.student_id_no}</p>`;
    });

    post.forEach((data) => {
      container += `<div class="m-3 p-3 " style="border-radius: 10px; background: rgba(0, 0, 0, 0.5)">
      <div
        class="card text-center w-100" style="border-radius: 10px; background: rgba(0, 0, 0, 0.5)"
        
        
      >
        
        <h5 class="card-title" style = "color: white">${data.title}</h5>
        
        <div class="row p-2" style = "color: white">
        <span>${data.body}</span>
        </div>
      </div>
      <div class="card-body">
  
        
        <div class="mt-2 d-flex justify-content-end">
          <!-- Button trigger modal -->
          <button id="btn_edit" type="button" class="mx-1 btn btn-outline-secondary" data-bs-toggle="modal" data-bs-target="#comment2">
            Edit 
          </button>
          <button data-id="${data.id}" type="button" id="delete_btn" class="mx-1 btn btn-outline-secondary">
         Delete
         </button>
          <!-- Modal -->
          <div class="modal fade" id="comment2" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="commentLabel2" aria-hidden="true">
            <div class="modal-dialog">
              <div class="modal-content">
                <div class="modal-header">
                  <h1 class="modal-title fs-5" id="commentLabel2">Comments</h1>
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
                      Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed
                      do eiusmod tempor incididunt ut labore et 
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
                      Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed
                      do eiusmod tempor incididunt ut labore et
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

    document.getElementById("imageContainer").innerHTML = imageContainer;
    document.getElementById("nameContainer").innerHTML = nameContainer;
    document.getElementById("idContainer").innerHTML = idContainer;
    document.getElementById("container").innerHTML = container;
  } catch {
    console.log("error");
  }
}

const deleteQuestion = async (e) => {
  const id = e.target.getAttribute("data-id");
  console.log(id);

  const isConfirmed = window.confirm(
    "Are you sure you want to delete question?"
  );

  // Check if the user has confirmed the deletion
  if (!isConfirmed) {
    return; // Abort the operation if the user cancels
  }

  try {
    const { error } = await supabase.from("post").delete().eq("id", id);
    alert("Post Successfully Deleted!");
    window.location.reload();
  } catch (error) {
    alert("Something wrong happened. Cannot delete item.");
    alert(error);
    /*  window.location.reload(); */
  }
};

let for_update_id = "";
const editAction = async (e) => {
 
  let { data: user_information, error } = await supabase
    .from("user_information")
    .select("*")
    .eq("id", userId);

  if (error == null) {

    for_update_id = user_information[0].id;

    document.getElementById("codename").value = user_information[0].code_name;
    document.getElementById("firstname").value = user_information[0].firstname;
    document.getElementById("lastname").value = user_information[0].lastname;
    document.getElementById("student_id_no").value = user_information[0].student_id_no;
    document.getElementById("user_program").value = user_information[0].user_program;
  
  } else {
    alert("Something wrong happened.");
    console.log(error);
  }
};

document.body.addEventListener("click", function (event) {
  if (event.target.id === "saveImage") {
    alert("w8 ka muna");
  }
});

document.body.addEventListener("click", function (event) {
  if (event.target.id === "delete_btn") {
    deleteQuestion(event);
  }
});

document.body.addEventListener("click", function (event) {
  if (event.target.id === "edit_profile") {
   editAction(event);
  }
});

document.body.addEventListener("click", function (event) {
  if (event.target.id === "information_btn") {
    alert("coffee starbucks muna? hahahah")
   /* editAction(event); */
  }
});
