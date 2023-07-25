let tbody = document.getElementById("tbody");
let form = document.getElementById("create-form");
let baseURL = "http://localhost:3000/api/v1/users";
fetch(baseURL)
    .then((res) => res.json())
    .then((data) => {
        let { users } = data;
        users.forEach((element, index) => {
            tbody.innerHTML += `
                <tr>
                    <th scope="row">${index + 1}</th>
                    <td>${element.id}</td>
                    <td>${element.email}</td>
                    <td>${element.password}</td>
                    <td>
                        <button type="button" class="btn btn-success">
                            Update
                        </button>
                        <button type="button" class="btn btn-danger" onClick="handleDelete(${
                            element.id
                        })">
                            Delete
                        </button>
                    </td>
                </tr>
           `;
        });
    })
    .catch((err) => {
        console.log(err);
    });

// ADD
form.addEventListener("submit", async (e) => {
    e.preventDefault();

    let user = {
        email: form.email.value,
        password: form.password.value,
    };

    try {
        let res = await fetch(baseURL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(user),
        });
        let data = await res.json();

        tbody.innerHTML += `
                <tr>
                    <th scope="row">${tbody.children.length + 1}</th>
                    <td>${data.id}</td>
                    <td>${user.email}</td>
                    <td>${user.password}</td>
                    <td>
                        <button type="button" class="btn btn-success">
                            Update
                        </button>
                        <button type="button" class="btn btn-danger" onClick="handleDelete(${
                            data.id
                        })">
                            Delete
                        </button>
                    </td>
                </tr>
           `;
    } catch (error) {
        console.log(error);
    }
});

// delete
const handleDelete = async (id) => {
    let res = await fetch(`http://localhost:3000/api/v1/users/${id}`, {
        method: "DELETE",
    });
    let data = await res.json();
    tbody.innerHTML = "";
    data.updateUsers.forEach((e, index) => {
        tbody.innerHTML += `<tr>
    <th scope="row">${tbody.children.length + 1}</th>
    <td>${e.id}</td>
    <td>${e.email}</td>
    <td>${e.password}</td>
    <td>
      <button type="button" class="btn btn-success">Update</button>
      <button type="button" class="btn btn-danger" onClick=handleDelete(${
          e.id
      })>Delete</button>
    </td>
  </tr>`;
    });
};
