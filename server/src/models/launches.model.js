const launchesDB = require("./launches.mongo");
const planets = require("./planets.mongo");

const launches = new Map();

let DEFAULT_FLIGHT_NUMBER = 100;

const launch = {
  flightNumber: 100,
  mission: "Kepler Exploration X",
  rocket: "Explorer IS1",
  launchDate: new Date("December27,2030"),
  target: "Kepler-442 b",
  customers: ["ZTM", "NASA"],
  upcoming: true,
  success: true,
};
saveLaunch(launch);

async function existsLaunchWithId(launchId) {
  return await launchesDB.findOne({
    flightNumber: launchId,
  });
}

async function getLatestFlightNumber() {
  // Sort through launches in descending order and return the first launch
  const latestLaunch = await launchesDB.findOne().sort("-flightNumber");
  if (!latestLaunch) {
    return DEFAULT_FLIGHT_NUMBER;
  }
  return latestLaunch.flightNumber;
}

async function saveLaunch(launch) {
  try {
    const planet = await planets.findOne({ keplerName: launch.target });
    if (!planet) {
      throw new Error("No mathcing planet found");
    }
    await launchesDB.findOneAndUpdate(
      {
        flightNumber: launch.flightNumber,
      },
      launch,
      { upsert: true }
    );
  } catch (err) {
    console.error(`Could not save launch ${err}`);
  }
}

async function getAllLaunches() {
  return await launchesDB.find({}, { _id: 0, __v: 0 });
}

async function scheduleNewLaunch(launch) {
  const newFlightNumber = (await getLatestFlightNumber()) + 1;
  const newLaunch = Object.assign(launch, {
    success: true,
    upcoming: true,
    customers: ["Zero to Mastery", "NASA"],
    flightNumber: newFlightNumber,
  });
  await saveLaunch(newLaunch);
}

async function abortLaunchById(launchId) {
  const aborted = await launchesDB.updateOne(
    {
      flightNumber: launchId,
    },
    {
      upcoming: false,
      success: false,
    }
  );

  return aborted.modifiedCount === 1 && aborted.matchedCount === 1
  // const aborted = launches.get(launchId);
  // aborted.upcoming = false;
  // aborted.success = false;
  // return aborted;
}

module.exports = {
  existsLaunchWithId,
  getAllLaunches,
  scheduleNewLaunch,
  abortLaunchById,
};
