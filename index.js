(function() {
  const MAX = 50;
  const EVENTS = Object.freeze({
    check: 'check',
    set: 'set'
  });

  // Random utils
  const getRandomInt = () => Math.floor(Math.random() * MAX);
  const generateBaseArray = (length = 20) =>
    [...Array(length)].map(getRandomInt);
  const wait = (time = 25) =>
    new Promise(resolve => {
      setTimeout(resolve, time);
    });

  ////////////////////////////////////////////////////////////
  // Sorts, mostly taken from https://medium.com/@rajat_m/implement-5-sorting-algorithms-using-javascript-63c5a917e811
  ////////////////////////////////////////////////////////////
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
    return arr;
  };
  const insertionSort = arr => {
    for (let i = 1; i < arr.length; i++) {
      for (let j = i - 1; j > -1; j--) {
        if (arr[j + 1] < arr[j]) {
          [arr[j + 1], arr[j]] = [arr[j], arr[j + 1]];
        }
      }
    }
    return arr;
  };
  const merge = (arr1, arr2) => {
    let res = [],
      i = 0,
      j = 0;

    while (i < arr1.length && j < arr2.length) {
      if (arr1[i] < arr2[j]) {
        res.push(arr1[i]);
        i++;
      } else {
        res.push(arr2[j]);
        j++;
      }
    }

    while (i < arr1.length) {
      res.push(arr1[i]);
      i++;
    }
    while (j < arr2.length) {
      res.push(arr2[j]);
      j++;
    }
    return res;
  };
  const mergeSort = arr => {
    if (arr.length <= 1) return arr;

    let mid = Math.floor(arr.length / 2);
    let left = mergeSort(arr.slice(0, mid));
    let right = mergeSort(arr.slice(mid));

    return merge(left, right);
  };
  const selectionSort = arr => {
    let min;
    for (let i = 0; i < arr.length; i++) {
      min = i;
      for (let j = i + 1; j < arr.length; j++) {
        if (arr[j] < arr[min]) {
          min = j;
        }
      }

      if (min !== i) {
        [arr[i], arr[min]] = [arr[min], arr[i]];
      }
    }
    return arr;
  };
  const partition = (arr, start = 0, end = arr.length - 1) => {
    let pivot = arr[start];
    let swapIdx = start;

    for (let i = start + 1; i <= end; i++) {
      if (arr[i] < pivot) {
        swapIdx++;
        [arr[i], arr[swapIdx]] = [arr[swapIdx], arr[i]];
      }
    }
    [arr[swapIdx], arr[start]] = [arr[start], arr[swapIdx]];

    return swapIdx;
  };
  const quickSort = (arr, left = 0, right = arr.length - 1) => {
    if (left < right) {
      let pivotIndex = partition(arr, left, right);
      quickSort(arr, left, pivotIndex - 1);
      quickSort(arr, pivotIndex + 1, right);
    }
    return arr;
  };
  const shellSort = arr => {
    let n = arr.length;

    for (let gap = Math.floor(n / 2); gap > 0; gap = Math.floor(gap / 2)) {
      for (let i = gap; i < n; i += 1) {
        let temp = arr[i];

        let j;
        for (j = i; j >= gap && arr[j - gap] > temp; j -= gap) {
          arr[j] = arr[j - gap];
        }

        arr[j] = temp;
      }
    }

    return arr;
  };
  ////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////

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
  const getDivHeight = height => `${height * 4}px`;
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

  const visualizeSort = async vizData => {
    const vizContainer = document.querySelector('#viz');

    for (let i = 0; i < vizData.events.length; i++) {
      const event = vizData.events[i];
      const vizItem = vizContainer.children[event.index];

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
    const vizData = withVisualization(baseArray);
    addVizToDOM(baseArray, vizData);

    return vizData;
  };

  const buildSortEventHandler = btn => async () => {
    document.querySelectorAll('button').forEach(btn => (btn.disabled = true));
    const vizData = buildFreshProxy();
    const sortType = btn.dataset.sort;

    switch (sortType) {
      case 'bubble':
        bubbleSort(vizData.proxy);
      case 'insertion':
        insertionSort(vizData.proxy);
      case 'selection':
        selectionSort(vizData.proxy);
      case 'merge':
        mergeSort(vizData.proxy);
      case 'quick':
        quickSort(vizData.proxy);
      case 'shell':
        shellSort(vizData.proxy);
      case 'native':
        vizData.proxy.sort((a, b) => a - b);
      default:
        await visualizeSort(vizData);
        document
          .querySelectorAll('button')
          .forEach(btn => (btn.disabled = false));
    }
  };

  // Show the initial array
  buildFreshProxy(baseArray);

  // Bind button event handlers
  document.querySelectorAll('button').forEach(btn => {
    btn.addEventListener('click', buildSortEventHandler(btn, baseArray));
  });
})();
