const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const { validateBody } = require("./Middlewares/users.middleware");
const app = express();

// Form HTML (action, method)
app.use(bodyParser.urlencoded({ extended: true }));

// Fetch api
app.use(bodyParser.json());

app.use(express.static("public"));
// define endpoint + HTTP request

// users api (endpoint)
// get
// get All records
app.get("/api/v1/users", (req, res) => {
    try {
        let users = JSON.parse(fs.readFileSync("./data/users.json"));
        res.json({
            users: users,
            status: "success",
        });
    } catch (error) {
        res.json({
            error: error,
        });
    }
});

// get ONE records
app.get("/api/v1/users/:id", (req, res) => {
    // logic
    let { id } = req.params;

    try {
        let users = JSON.parse(fs.readFileSync("./data/users.json"));
        let user = users.find((e, i) => e.id === Number(id));
        if (!user) {
            res.json({
                message: "User not found",
            });
        } else {
            res.json({
                user: user,
            });
        }
    } catch (error) {
        res.json({
            error: error,
        });
    }
});

// post
app.post("/api/v1/users", validateBody, (req, res) => {
    // logic
    let { email, password } = req.body;
    let user = {
        id: Math.floor(Math.random() * 1000000000000000),
        email,
        password,
    };
    try {
        let users = JSON.parse(fs.readFileSync("./data/users.json"));
        users.push(user);
        fs.writeFileSync("./data/users.json", JSON.stringify(users));
        res.json({
            message: "Create user successfully",
            id: user.id,
        });
    } catch (error) {
        res.json({
            error: error,
        });
    }
});

// put
app.put("/api/v1/users/:id", (req, res) => {
    // logic
    let { id } = req.params;
    let { email, password } = req.body;

    try {
        let users = JSON.parse(fs.readFileSync("./data/users.json"));
        let userIndex = users.findIndex((e, i) => e.id === Number(id));

        if (userIndex === -1) {
            res.json({
                message: "User not found",
            });
        } else {
            // Update the user information
            users[userIndex].email = email;
            users[userIndex].password = password;

            // Save the updated user data back to the file
            fs.writeFileSync("./data/users.json", JSON.stringify(users));

            res.json({
                message: "Update user successfully",
                user: users[userIndex],
            });
        }
    } catch (error) {
        res.json({
            error: error,
        });
    }
});

// delete
app.delete("/api/v1/users/:id", (req, res) => {
    // logic
    let { id } = req.params;
    let users = JSON.parse(fs.readFileSync("./data/users.json"));
    let updatedUsers = users.filter((user, index) => user.id != id);
    fs.writeFileSync("./data/users.json", JSON.stringify(updatedUsers));
    res.json({
        message: "Delete user successfully",
        updateUsers: updatedUsers,
    });
});

app.get("/", function (req, res) {
    console.log(__dirname);
    res.sendFile(`${__dirname}/public/homepage.html`);
});

app.listen(3000, () => {
    console.log("Server is running on http://localhost:3000");
});
