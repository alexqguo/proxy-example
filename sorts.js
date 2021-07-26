////////////////////////////////////////////////////////////
// Sorts, mostly taken from https://medium.com/@rajat_m/implement-5-sorting-algorithms-using-javascript-63c5a917e811
////////////////////////////////////////////////////////////
export const bubbleSort = arr => {
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

export const cocktailSort = arr => {
  let start = 0,
    end = arr.length,
    swapped = true;

  while (swapped) {
    swapped = false;
    for (let i = start; i < end - 1; i++) {
      if (arr[i] > arr[i + 1]) {
        let temp = arr[i];
        arr[i] = arr[i + 1];
        arr[i + 1] = temp;
        swapped = true;
      }
    }

    end--;
    if (!swapped) break;

    swapped = false;
    for (let i = end - 1; i > start; i--) {
      if (arr[i - 1] > arr[i]) {
        let temp = arr[i];
        arr[i] = arr[i - 1];
        arr[i - 1] = temp;
        swapped = true;
      }
    }

    start++;
  }

  return arr;
};

export const insertionSort = arr => {
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
export const mergeSort = arr => {
  if (arr.length <= 1) return arr;

  let mid = Math.floor(arr.length / 2);
  let left = mergeSort(arr.slice(0, mid));
  let right = mergeSort(arr.slice(mid));

  return merge(left, right);
};

export const selectionSort = arr => {
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
export const quickSort = (arr, left = 0, right = arr.length - 1) => {
  if (left < right) {
    let pivotIndex = partition(arr, left, right);
    quickSort(arr, left, pivotIndex - 1);
    quickSort(arr, pivotIndex + 1, right);
  }
  return arr;
};

export const shellSort = arr => {
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

export const heapSort = array => {
  let size = array.length;

  for (let i = Math.floor(size / 2 - 1); i >= 0; i--) heapify(array, size, i);

  for (let i = size - 1; i >= 0; i--) {
    let temp = array[0];
    array[0] = array[i];
    array[i] = temp;

    heapify(array, i, 0);
  }
  return array;
};
const heapify = (array, size, i) => {
  let max = i;
  let left = 2 * i + 1;
  let right = 2 * i + 2;

  if (left < size && array[left] > array[max]) max = left;
  if (right < size && array[right] > array[max]) max = right;

  if (max != i) {
    let temp = array[i];
    array[i] = array[max];
    array[max] = temp;

    heapify(array, size, max);
  }
};
