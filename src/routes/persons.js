"strict mode";

const router = require("express").Router();
const PersonModel = require("../models/person");

// Get All Person Data
router.get("/", async (req, res) => {
  const persons = await PersonModel.find({});
  if (persons.length === 0)
    return res.status(404).send({
      message: "persons 컬렉션에 데이터가 없습니다.",
    });
  res.status(200).send(persons);
});

// Get a Person Data
router.get("/:id", async (req, res) => {
  const person = await PersonModel.find({ personId: req.params.id });
  if (!person)
    return res.status(404).send({
      message: "해당 id를 가진 데이터가 없습니다.",
    });
  res.status(200).send(person);
});

// Create a Person Data
router.post("", async (req, res) => {
  const person = await PersonModel({
    personId: crypto.randomUUID(),
    ...req.body,
  }).save();
  res.status(201).send({
    message: "새로운 Person 도큐먼트가 생성되었습니다.",
    data: person,
  });
});

// Update a Person Data
router.post("/:id", async (req, res) => {
  const person = await PersonModel.findOneAndUpdate(
    { personId: req.params.id },
    req.body,
    {
      new: true,
    }
  );
  res.status(201).send({
    message: "새로운 Person 도큐먼트가 생성되었습니다.",
    data: person,
  });
});

module.exports = router;
