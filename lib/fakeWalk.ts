// Dev-only: fakes a user walking so follow mode can be tested at a desk.
// Turn it on by adding ?fakeWalk to the URL, e.g. http://localhost:3000/?fakeWalk

const START: [number, number] = [34.0211, -118.3965];
const STEP = 0.0001; // degrees per tick, roughly 10 meters
const STEPS_PER_SIDE = 20;
const TICK_MS = 1000;

// Walks a square: east, north, west, south, then repeats.
function pointAt(tick: number): [number, number] {
  const side = Math.floor(tick / STEPS_PER_SIDE) % 4;
  const along = (tick % STEPS_PER_SIDE) * STEP;
  const edge = STEPS_PER_SIDE * STEP;
  const [lat, lng] = START;

  if (side === 0) return [lat, lng + along];
  if (side === 1) return [lat + along, lng + edge];
  if (side === 2) return [lat + edge, lng + edge - along];
  return [lat + edge - along, lng];
}

let installed = false;

export function installFakeWalk() {
  if (installed) return;
  if (typeof window === "undefined") return;
  if (!new URLSearchParams(window.location.search).has("fakeWalk")) return;
  installed = true;

  const timers = new Map<number, ReturnType<typeof setInterval>>();
  let nextId = 1;

  Object.defineProperty(navigator.geolocation, "watchPosition", {
    value: (success: PositionCallback) => {
      const id = nextId++;
      let tick = 0;
      const emit = () => {
        const [latitude, longitude] = pointAt(tick++);
        success({
          coords: { latitude, longitude, accuracy: 5 },
          timestamp: Date.now(),
        } as GeolocationPosition);
      };
      emit();
      timers.set(id, setInterval(emit, TICK_MS));
      return id;
    },
  });

  Object.defineProperty(navigator.geolocation, "clearWatch", {
    value: (id: number) => {
      clearInterval(timers.get(id));
      timers.delete(id);
    },
  });

  console.info("[fakeWalk] Fake location is on.");
}
