"strict mode";

const router = require("express").Router();
const PersonModel = require("../models/person");
const personLib = require("../lib/person-redis");

// Get All Person Data
router.get("/", async (_, res, next) => {
  const persons = await personLib.getAllFriends();

  if (persons.length === 0)
    return res.status(404).send({
      message: "persons 컬렉션에 데이터가 없습니다.",
    });

  res.status(200).send(persons);

  next();
});

// Get a Person Data
router.get("/:id", async (req, res, next) => {
  const person = await personLib.getPersonInfo(req.params.id);

  if (!person)
    return res.status(404).send({
      message: "해당 id를 가진 데이터가 없습니다.",
    });

  res.status(200).send(person);

  next();
});

// Create a Person Data
router.post("", async (req, res, next) => {
  const person = await personLib.registerPersonInfo(req.body);

  res.status(201).send({
    message: "새로운 Person 도큐먼트가 생성되었습니다.",
    data: person,
  });

  next();
});

// Update a Person Data
router.patch("/:id", async (req, res, next) => {
  // update service
  const person = personLib.updatePersonInfo(req.params.id, req.body);

  res.status(201).send({
    message: "Person 도큐먼트 하나가 수정되었습니다.",
    data: person,
  });

  next();
});

router.get("/:id/friends", async (req, res, next) => {
  const friendInfos = personLib.getAllFriends(req.params.id);

  res.status(200).json({
    message: "OK",
    data: friendInfos,
  });

  next();
});

module.exports = router;
