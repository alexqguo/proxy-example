import { EVENTS } from './enums';

export const withVisualization = arr => {
  // Shallow clone array to prevent modification on the original
  const events = [];
  const clone = [...arr];
  clone.__getEvents = () => events;

  return new Proxy(clone, {
    get: (obj, key) => {
      const isValidArrayIndex = !isNaN(Number(key));

      if (isValidArrayIndex) {
        events.push({
          type: EVENTS.check,
          index: Number(key)
        });
      }

      return obj[key];
    },
    set: (obj, key, val) => {
      events.push({
        type: EVENTS.set,
        index: Number(key),
        value: val
      });
      obj[key] = val;
      return true;
    }
  });
};

export default withVisualization;
