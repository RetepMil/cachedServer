"strict mode";

const router = require("express").Router();
const PersonModel = require("../models/person");

// Get All Person Data
router.get("/", async (_, res, next) => {
  const persons = await PersonModel.find({});

  if (persons.length === 0)
    return res.status(404).send({
      message: "persons 컬렉션에 데이터가 없습니다.",
    });

  res.status(200).send(persons);

  next();
});

// Get a Person Data
router.get("/:id", async (req, res, next) => {
  const person = await PersonModel.findOne({ personId: req.params.id });

  if (!person)
    return res.status(404).send({
      message: "해당 id를 가진 데이터가 없습니다.",
    });

  res.status(200).send(person);

  next();
});

// Create a Person Data
router.post("", async (req, res, next) => {
  const person = await PersonModel({
    personId: crypto.randomUUID().replaceAll("-", ""),
    ...req.body,
  }).save();

  res.status(201).send({
    message: "새로운 Person 도큐먼트가 생성되었습니다.",
    data: person,
  });

  next();
});

// Update a Person Data
router.patch("/:id", async (req, res, next) => {
  const person = await PersonModel.findOneAndUpdate(
    { personId: req.params.id },
    req.body,
    {
      new: true,
    }
  );

  res.status(201).send({
    message: "Person 도큐먼트 하나가 수정되었습니다.",
    data: person,
  });

  next();
});

router.get("/:id/friends", async (req, res, next) => {
  const person = await PersonModel.findOne({ personId: req.params.id });
  if (!person)
    return res.status(404).send({
      message: "해당 id를 가진 데이터가 없습니다.",
    });

  const { name, friendList } = person;
  if (friendList.length === 0)
    return res.status(404).send({
      message: `${name}의 친구 정보가 없습니다.`,
    });

  const ret = [];
  for (const id in friendList) {
    const friend = await PersonModel.findOne({ personId: id });
    ret.push(friend);
  }

  res.status(200).json({
    message: "OK",
    data: ret,
  });

  next();
});

module.exports = router;
