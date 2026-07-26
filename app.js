const express = require("express"); //returns a function.
const fs = require("fs"); //returns an object.
const path = require("path"); //used to construct complete paths which works on all operating systems with minimal effort.

const app = express(); //returns an object to app variable.

//middleware function
app.use(express.urlencoded({ extended: false })); //urlencoded is a method that set up a body parser, incoming request data parser, that lookup the incoming request and if they carry data it will parse that incoming data and translate it into the javascript object(JSON) format.

app.get("/", (req, res) => {
  res.send(
    "<form action='/store-user' method='POST'><label>Your Name: </label><input type='text' name='username'/><button>Submit</button></form>",
  );
});

app.post("/store-user", (req, res) => {
  const username = req.body.username; //bina app.use(urlencoded({extended: false})) ke ye nhi chalgega, error throgh karega, kyuki node plain text ko samaj nhi paata to usko pehle javascript object format mai convert krna padta hai. (json)
  const filePath = path.join(__dirname, "data", "users.json"); //__dirname holds the absolute path to this directory, it is a globally exposed variable built-in node.js variable.
  const fileData = fs.readFileSync(filePath); //returns data in raw text.
  const existingUsers = JSON.parse(fileData); //convert raw text data into JSON format.
  existingUsers.push(username); //appending data to the end of the array.
  fs.writeFileSync(filePath, JSON.stringify(existingUsers)); //where the file is in which we have to store data. takes data in raw text isley existingUsers jo ki array hai isko raw text mai badalne ke liye stringify method ka use kiya hai.

  res.redirect("/users");
});

app.get("/users", (req, res) => {
  const filePath = path.join(__dirname, "data", "users.json");
  const fileData = fs.readFileSync(filePath);
  const existingUsers = JSON.parse(fileData);
  // console.log(existingUsers);
  let list_of_users = "";
  for (const user of existingUsers) {
    list_of_users += `<ul><li>${user}</li></ul>`;
  }

  res.send(list_of_users);
});

app.listen(3000);
