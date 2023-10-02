const fs = require("fs");
const path = require("path");
const { parse } = require("csv-parse");

const planets = require("./planets.mongo");

const OnePointSixTimesEarthRadius = 1.6;
const zeroPointThreeSixTimesEarthValue = 0.36;
const onePointOneOneEarthValue = 1.11;

function isHabitablePlanet(planet) {
  return (
    planet["koi_disposition"] === "CONFIRMED" &&
    planet["koi_insol"] > zeroPointThreeSixTimesEarthValue &&
    planet["koi_insol"] < onePointOneOneEarthValue &&
    planet["koi_prad"] < OnePointSixTimesEarthRadius
  );
}
function loadPlanetsData() {
  return new Promise((resolve, reject) => {
    fs.createReadStream(
      path.join(__dirname, "..", "..", "data", "/kepler_data.csv")
    )
      .pipe(
        parse({
          comment: "#",
          columns: true, // Corrected typo here
        })
      )
      .on("data", async (data) => {
        if (isHabitablePlanet(data)) {
          //Todo: Upsert
          savePlanet(data);
        }
      })
      .on("error", (error) => {
        console.log(error);
        reject(err);
      })
      .on("end", async () => {
        const countPlanetsFound = (await getAllPlanets()).length;
        console.log("Number of planets", countPlanetsFound);
        resolve();
        console.log("done processing");
      });
  });
}

async function getAllPlanets() {
  // second object is the filter
  return await planets.find({}, { _id: 0, __v: 0 });
}

async function savePlanet(planet) {
  try {
    await planets.updateOne(
      { keplerName: planet.kepler_name },
      { keplerName: planet.kepler_name },
      { upsert: true }
    );
  } catch (err) {
    console.error(`Could not save planet ${err}`);
  }
}

module.exports = { loadPlanetsData, getAllPlanets };
