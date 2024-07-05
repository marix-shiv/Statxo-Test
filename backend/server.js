const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
app.use(cors());
app.use(bodyParser.json());

let data = [
  {
    id: 1,
    quantity: 100,
    amount: 100,
    postingYear: 2020,
    postingMonth: "January",
    actionType: "Type1",
    actionNumber: "001",
    actionName: "Action1",
    status: "Pending",
    Impact: "High",
  },
  {
    id: 2,
    quantity: 10,
    amount: 100,
    postingYear: 2020,
    postingMonth: "January",
    actionType: "Type2",
    actionNumber: "001",
    actionName: "Action2",
    status: "Pending",
    Impact: "Mid",
  },
  {
    id: 3,
    quantity: 120,
    amount: 100,
    postingYear: 2020,
    postingMonth: "January",
    actionType: "Type1",
    actionNumber: "001",
    actionName: "Action1",
    status: "Pending",
    Impact: "Low",
  },
  {
    id: 4,
    quantity: 132,
    amount: 100,
    postingYear: 2020,
    postingMonth: "January",
    actionType: "Type3",
    actionNumber: "001",
    actionName: "Action3",
    status: "Pending",
    Impact: "High",
  },
  {
    id: 5,
    quantity: 10,
    amount: 100,
    postingYear: 2020,
    postingMonth: "January",
    actionType: "Type2",
    actionNumber: "001",
    actionName: "Action3",
    status: "Pending",
    Impact: "Low",
  },
];

app.get("/data", (req, res) => {
  res.json(data);
});

app.post("/update", (req, res) => {
  const updates = req.body;
  updates.forEach((update) => {
    const item = data.find((d) => d.id === update.id);
    if (item) {
      Object.assign(item, update);
    }
  });
  res.json({ message: "Data updated successfully" });
});

app.listen(3001, () => {
  console.log("Server running on port 3001");
});
