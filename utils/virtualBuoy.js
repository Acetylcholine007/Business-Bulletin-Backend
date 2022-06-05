const axios = require("axios").default;
const perlinNoise3d = require("perlin-noise-3d");

const timer = (ms) => new Promise((res) => setTimeout(res, ms));
const noise = new perlinNoise3d();
const URL = "https://flood-buoy.herokuapp.com";
noise.noiseSeed(Math.E);

noiseOffset = (baseValue, magnitude, step, limits) => {
  let y = noise.get(step) * magnitude;
  let output = (baseValue + y).toFixed(2);
  if (output < limits[0]) {
    return limits[0];
  } else if (output > limits[1]) {
    return limits[1];
  } else {
    return output;
  }
};

async function transmit(serialKey, offset) {
  try {
    let noiseStep = 0;

    for (;;) {
      let datetime = new Date();
      console.log(datetime.toLocaleString());

      axios
        .post(`${URL}/test/postRead`, {
          serialKey: serialKey,
          floodLevel: Math.round(
            noiseOffset(30, 70, noiseStep + offset, [0, 100])
          ),
          precipitation: noiseOffset(40, 60, noiseStep + 1 + offset, [0, 100]),
          current: Math.round(
            noiseOffset(50, 50, noiseStep + 2 + offset, [0, 100])
          ),
          turbidity: Math.round(
            noiseOffset(60, 40, noiseStep + 3 + offset, [0, 100])
          ),
          date: `${datetime.getMonth() + 1}/${datetime.getDate()}/${2022}`,
          time: `${
            datetime.getHours() + 1
          }:${datetime.getMinutes()}:${datetime.getSeconds()}`,
        })
        .then(function (response) {
          console.log(response.data);
        })
        .catch(function (error) {
          console.log(error);
        });

      noiseStep += 0.1;
      await timer(2000);
      // break;
    }
  } catch (e) {
    console.log(e);
  }
}

transmit("FB-03-12-01", 2);
transmit("FB-03-12-02", 3);
transmit("FB-03-12-03", 4);
