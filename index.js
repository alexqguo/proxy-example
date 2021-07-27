import {
  heapSort,
  gnomeSort,
  mergeSort,
  quickSort,
  shellSort,
  bubbleSort,
  cocktailSort,
  insertionSort,
  selectionSort
} from './sorts';
import { EVENTS } from './enums';
import { playWow, playSound } from './audio';
import withVisualization from './withVisualization';

const MAX = 100;

// Random utils
const getRandomInt = () => Math.floor(Math.random() * MAX);
const generateBaseArray = (length = 80) => [...Array(length)].map(getRandomInt);
const wait = (time = 0) =>
  new Promise(resolve => {
    setTimeout(resolve, time);
  });

// DOM utils
const getDivHeight = height => `${height * 4}px`;
const resetDOM = arr => {
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

const visualizeSort = async events => {
  const vizContainer = document.querySelector('#viz');
  const soundInput = document.querySelector('#sound');

  for (let i = 0; i < events.length; i++) {
    const event = events[i];
    const vizItem = vizContainer.children[event.index];

    if (event.type === EVENTS.check) {
      vizItem.classList.add(EVENTS.check);
    } else if (event.type === EVENTS.set) {
      vizItem.classList.add(EVENTS.set);
      vizItem.style.height = getDivHeight(event.value);
      soundInput.checked && playSound(event.value);
    }

    await wait();
    vizItem.classList.remove(...Object.values(EVENTS));
  }
};

// Generate base array and display it
const baseArray = generateBaseArray();
resetDOM(baseArray);

const buildFreshProxy = () => {
  const vizArray = withVisualization(baseArray);
  resetDOM(baseArray);

  return vizArray;
};

const buildSortEventHandler = btn => async () => {
  document.querySelectorAll('button').forEach(btn => (btn.disabled = true));
  const vizArray = buildFreshProxy();
  const sortType = btn.dataset.sort;

  switch (sortType) {
    case 'bubble':
      bubbleSort(vizArray);
      break;
    case 'cocktail':
      cocktailSort(vizArray);
      break;
    case 'insertion':
      insertionSort(vizArray);
      break;
    case 'selection':
      selectionSort(vizArray);
      break;
    case 'shell':
      shellSort(vizArray);
      break;
    case 'gnome':
      gnomeSort(vizArray);
      break;
    case 'merge':
      mergeSort(vizArray);
      break;
    case 'heap':
      heapSort(vizArray);
      break;
    case 'quick':
      quickSort(vizArray);
      break;
    case 'native':
      vizArray.sort((a, b) => a - b);
      break;
  }

  const vizEvents = vizArray.__getEvents();
  console.log(vizEvents);
  await visualizeSort(vizEvents);

  playWow();
  document.querySelectorAll('button').forEach(btn => (btn.disabled = false));
};

// Bind button event handlers
document.querySelectorAll('button').forEach(btn => {
  btn.addEventListener('click', buildSortEventHandler(btn, baseArray));
});
