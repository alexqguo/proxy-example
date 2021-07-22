(function() {
  let vizData;
  let vizArray;

  const MAX = 50;
  const EVENTS = Object.freeze({
    check: 'check',
    set: 'set'
  });

  // Random utils
  const getDivHeight = height => `${height * 4}px`;
  const getRandomInt = () => Math.floor(Math.random() * MAX);
  const generateBaseArray = (length = 20) => {
    const array = [];

    for (let i = 0; i < length; i++) {
      array.push(getRandomInt());
    }

    return array;
  };
  const wait = (time = 25) =>
    new Promise(resolve => {
      setTimeout(resolve, time);
    });

  // Sorts, mostly taken from random SO posts
  const bubbleSort = arr => {
    for (let i = 0; i < arr.length; i++) {
      for (let j = 0; j < arr.length - i - 1; j++) {
        if (arr[j] > arr[j + 1]) {
          const temp = arr[j];
          arr[j] = arr[j + 1];
          arr[j + 1] = temp;
        }
      }
    }
  };

  // What actually does the stuff
  const withVisualization = arr => {
    // Shallow clone array to prevent modification on the original
    const events = [];
    const proxy = new Proxy([...arr], {
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

    return {
      proxy,
      events
    };
  };

  // DOM utils
  const addVizToDOM = arr => {
    const frag = document.createDocumentFragment();
    const vizContainer = document.querySelector('#viz');

    // Show the initial list
    vizContainer.innerHTML = '';
    arr.forEach(item => {
      const el = document.createElement('div');
      el.dataset.value = item;
      el.style.height = getDivHeight(item);
      frag.appendChild(el);
    });
    vizContainer.appendChild(frag);
  };

  const visualizeSort = async () => {
    console.log(vizData);
    const vizContainer = document.querySelector('#viz');

    for (let i = 0; i < vizData.events.length; i++) {
      const event = vizData.events[i];
      const vizItem = vizContainer.children[event.index];
      // const vizIndex = Number(event.index);

      if (event.type === EVENTS.check) {
        vizItem.classList.add(EVENTS.check);
      } else if (event.type === EVENTS.set) {
        vizItem.classList.add(EVENTS.set);
        vizItem.style.height = getDivHeight(event.value);
      }

      await wait();
      vizItem.classList.remove(...Object.values(EVENTS));
    }
  };

  // Generate base array
  const baseArray = generateBaseArray();
  document.querySelector('#base-array').innerHTML = JSON.stringify(baseArray);

  const buildFreshProxy = () => {
    vizArray = [...baseArray];
    vizData = withVisualization(baseArray);
    addVizToDOM(vizArray, vizData);
  };

  const buildSortEventHandler = btn => () => {
    buildFreshProxy();
    const sortType = btn.dataset.sort;

    switch (sortType) {
      case 'bubble':
        bubbleSort(vizData.proxy);
      case 'native':
        vizData.proxy.sort((a, b) => a - b);
      default:
        visualizeSort();
    }
  };

  // Show the initial array
  buildFreshProxy(baseArray);

  // Bind button event handlers
  document.querySelectorAll('button').forEach(btn => {
    btn.addEventListener('click', buildSortEventHandler(btn, baseArray));
  });

  window.ba = baseArray;
})();
