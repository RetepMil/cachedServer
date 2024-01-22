"strict mode";

const PersonModel = require("../models/person");
const redisClient = require("../resources/redis");

const getAllPersonInfos = async () => {
  const keys = await redisClient.keys("person:*");

  if (keys.length === 0) return [];

  const entries = await redisClient.mGet(keys);

  return entries.map(JSON.parse);
};

const getPersonInfo = async (personId) => {
  const key = `person:${personId}`;
  let personDoc = await redisClient.get(personId);

  if (!personDoc) {
    personDoc = await PersonModel.findOne({ personId });
    if (!personDoc) return null;

    await redisClient.set(key, personDoc);
  }

  return personDoc;
};

const registerPersonInfo = async (personInfo) => {
  const personDoc = {
    personId: crypto.randomUUID().replaceAll("-", ""),
    ...personInfo,
  };

  const person = await PersonModel(personDoc).save();

  const key = `person:${personDoc.personId}`;
  await redisClient.set(key, person);

  return person;
};

const updatePersonInfo = async (personId, updateInfo) => {
  const person = await PersonModel.findOneAndUpdate(
    { personId: req.params.id },
    updateInfo,
    {
      new: true,
    }
  );

  const key = `person:${personId}`;
  await redisClient.set(key, person);

  return person;
};

const getAllFriends = async (personId) => {
  const { name, friendList } = await getPersonInfo(personId);
  if (friendList.length === 0)
    return res.status(404).send({
      message: `${name}의 친구 정보가 없습니다.`,
    });

  const ret = [];
  for (const id in friendList) {
    const friend = await getPersonInfo(id);
    ret.push(friend);
  }

  return ret;
};

module.exports = {
  getAllPersonInfos,
  getPersonInfo,
  registerPersonInfo,
  updatePersonInfo,
  getAllFriends,
};
