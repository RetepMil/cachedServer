"strict mode";

require("dotenv").config();

const express = require("express");
const moment = require("moment");
const mongoose = require("mongoose");
const app = express();

const { PORT, MONGO_BASE_URI, DB_NAME } = process.env;

mongoose.Promise = global.Promise;

mongoose
  .connect(`${MONGO_BASE_URI}/${DB_NAME}`)
  .then(() => console.log("MongoDB 접속 완료"))
  .catch((e) => console.error(e));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// 시간 측정
app.use((req, _, next) => {
  if (req.path === "/health") next();
  else {
    req.startTime = moment();
    console.log(`요청 인입 시간 : ${req.startTime}`);
    next();
  }
});

app.get("/health", (req, res, next) => {
  res.status(200).json({
    data: {
      message: "OK",
    },
  });
  next();
});

app.use("/persons", require("./routes/persons"));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({
    message: "서버에서 예기치 못한 오류가 발생했습니다.",
  });
});

app.use((req, _, next) => {
  if (req.startTime) {
    console.log(
      `처리에 걸린 시간 : ${
        moment.duration(moment().diff(req.startTime)).asMilliseconds() / 1000
      }s`
    );
  }
  next();
});

app.listen(PORT, () => {
  console.log(`Express server is listening on port ${PORT}`);
});
