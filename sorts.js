////////////////////////////////////////////////////////////
// Sorts, mostly taken from https://medium.com/@rajat_m/implement-5-sorting-algorithms-using-javascript-63c5a917e811
// or other random posts
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

export const gnomeSort = arr => {
  const moveBack = i => {
    for (; i > 0 && arr[i - 1] > arr[i]; i--) {
      var t = arr[i];
      arr[i] = arr[i - 1];
      arr[i - 1] = t;
    }
  };
  for (var i = 1; i < arr.length; i++) {
    if (arr[i - 1] > arr[i]) moveBack(i);
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

const mergeInPlace = (arr, start, mid, end) => {
  let start2 = mid + 1;

  if (arr[mid] <= arr[start2]) {
    return;
  }

  while (start <= mid && start2 <= end) {
    if (arr[start] <= arr[start2]) {
      start++;
    } else {
      let value = arr[start2];
      let index = start2;

      while (index != start) {
        arr[index] = arr[index - 1];
        index--;
      }
      arr[start] = value;

      start++;
      mid++;
      start2++;
    }
  }
};
export const mergeSortInPlace = (arr, l, r) => {
  if (l < r) {
    let m = l + Math.floor((r - l) / 2);

    mergeSortInPlace(arr, l, m);
    mergeSortInPlace(arr, m + 1, r);

    mergeInPlace(arr, l, m, r);
  }
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

const flip = (arr, i) => {
  let temp,
    start = 0;
  while (start < i) {
    temp = arr[start];
    arr[start] = arr[i];
    arr[i] = temp;
    start++;
    i--;
  }
};
const findMax = (arr, n) => {
  let mi, i;
  for (mi = 0, i = 0; i < n; ++i) if (arr[i] > arr[mi]) mi = i;

  return mi;
};
export const pancakeSort = (arr, n) => {
  for (let curr_size = n; curr_size > 1; --curr_size) {
    let mi = findMax(arr, curr_size);
    if (mi != curr_size - 1) {
      flip(arr, mi);
      flip(arr, curr_size - 1);
    }
  }

  return arr;
};
