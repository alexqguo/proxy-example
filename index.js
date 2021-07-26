import {
  heapSort,
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
  const soundInput = document.querySelector('#sound');

  for (let i = 0; i < vizData.events.length; i++) {
    const event = vizData.events[i];
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

// Generate base array
const baseArray = generateBaseArray();

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
      break;
    case 'cocktail':
      cocktailSort(vizData.proxy);
      break;
    case 'insertion':
      insertionSort(vizData.proxy);
      break;
    case 'selection':
      selectionSort(vizData.proxy);
      break;
    case 'shell':
      shellSort(vizData.proxy);
      break;
    case 'merge':
      mergeSort(vizData.proxy);
      break;
    case 'heap':
      heapSort(vizData.proxy);
      break;
    case 'quick':
      quickSort(vizData.proxy);
      break;
    case 'native':
      vizData.proxy.sort((a, b) => a - b);
      break;
  }

  console.log(vizData);
  await visualizeSort(vizData);
  playWow();
  document.querySelectorAll('button').forEach(btn => (btn.disabled = false));
};

// Show the initial array
buildFreshProxy(baseArray);

// Bind button event handlers
document.querySelectorAll('button').forEach(btn => {
  btn.addEventListener('click', buildSortEventHandler(btn, baseArray));
});
