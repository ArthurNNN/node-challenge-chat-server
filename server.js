const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const messages = [
  { id: 0, from: "Bart", text: "Welcome to CYF chat system!" },
  { id: 1, from: "Anne", text: "Good to see you" },
  { id: 2, from: "Helen", text: "Long time, no see" },
  { id: 3, from: "Anne", text: "let's go for a coffee" },
];

function getNextId() {
  const lastMessage = messages[messages.length - 1].id;
  const nextId = parseInt(lastMessage) + 1;
  return nextId;
}

app.get("/", function (request, response) {
  response.sendFile(__dirname + "/index.html");
});

app.get("/messages", (req, res) => {
  res.status(201).send(messages);
});

app.get("/messages/search", (req, res) => {
  const text = req.query.text;
  const result = messages.filter(message => message.text.includes(text));
  if (result.length > 0) {
    res.status(201).send(result);
  } else {
    res.status(404).send("These messages not found");
  }
});

app.get("/messages/lastest", (req, res) => {
  const result = messages.slice(messages.length - 10);
  console.log(messages.length - 10)
  console.log(result)
  if (result.length > 0) {
    res.status(201).send(result);
  } else {
    res.status(404).send("These messages not found");
  }
});

app.get("/messages/:id", (req, res) => {
  const messageId = parseInt(req.params.id);
  const message = messages.find((message) => message.id === messageId);
  if (message) {
    res.status(201).send(message);
  } else {
    res.status(404).send("This message does not exist");
  }
});

app.post("/messages", (req, res) => {
  const { from, text } = req.body;
  const id = getNextId();
  const timeSent = new Date();
  const newMessage = { id: id, from: from, text: text, timeSent: timeSent.toLocaleString() };
  if (from === "" || text === "") {
    res.status(400).send("This message is not complete.");
  } else {
    messages.push(newMessage);
    res.status(201).send(newMessage);
  }
});

app.put("/messages/:id", (req, res) => {
  const messageId = parseInt(req.params.id);
  let updatedMessage = req.body;
  console.log(updatedMessage);

  let message = messages.find((message) => message.id === messageId);
  if (message) {
    message.from = updatedMessage.from;
    message.text = updatedMessage.text;
    res.status(201).send(updatedMessage);
  } else {
    res.status(404).send("This message does not exist");
  }
});

app.delete("/messages/:id", (req, res) => {
  const messageId = parseInt(req.params.id);
  const message = messages.find((message) => message.id === messageId);
  if (message) {
    const index = messages.indexOf(message);
    messages.splice(index, 1);
    res.status(201).send({ success: true });
  } else {
    res.status(404).send("This message does not exist");
  }
});

app.listen(3000, () => {
  console.log("Listening on port 3000");
});
