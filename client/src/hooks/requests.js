const API_URL = "http://localhost:8000/v1";

async function httpGetPlanets() {
  // TODO: Once API is ready.
  const response = await fetch(`${API_URL}/planets`);
  // Load planets and return as JSON.
  return await response.json();
}

async function httpGetLaunches() {
  // TODO: Once API is ready.
  const response = await fetch(`${API_URL}/launches`);
  // Load launches, sort by flight number, and return as JSON.
  const fetchedLaunches = await response.json();
  return fetchedLaunches.sort((a, b) => {
    return a.flightNumber - b.flightNumber;
  });
}

async function httpSubmitLaunch(launch) {
  try {
    return await fetch(`${API_URL}/launches`, {
      method: "post",
      headers: { "Content-Type": "application/json" }, // Corrected typo here
      body: JSON.stringify(launch),
    });
  } catch (error) {
    console.log(error);
    return {
      ok: false,
    };
  }
  // Submit given launch data to launch system.
}

async function httpAbortLaunch(id) {
  // Delete launch with given ID.
  try {
    const response = await fetch(`${API_URL}/launches/${id}`, {
      method: "delete",
    });
    return response;
  } catch (error) {
    console.log(error);
    return {
      ok: false,
    };
  }
}

export { httpGetPlanets, httpGetLaunches, httpSubmitLaunch, httpAbortLaunch };
