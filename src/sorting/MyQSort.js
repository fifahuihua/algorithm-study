/************************************************************************
 * Author:      Antony Zhang
 * Created:     2018-12-07
 * Description: This files is an algorithm to get n biggest numbers
 *              from an unsorted array. The unsorted array size maybe 
 *              is very large. 
 * Design:      1. Sorting the array with quick sorting algorithm.
 *              2. If the pivot index is less than array.length-n,
 *                 then stop to sorting the left part of array.
 * 
 * Assumption:  array = [8, 4, 6, 7, 2, 5, 2, 7], n = 3
 * Expected:    [7, 7, 8] 
 ***********************************************************************/

const CommonUtil = require("../utils/common.util");
const PARTITION_ERROR = -1;

/**
 * Parting the array with the first item as pivot. Put all the items bigger
 * than the pivot into right of pivot, and put the items less than pivot 
 * into the left of pivot.
 * 
 * Example: array = [5, 9, 2, 4, 7, 3, 2] and partition(array, 0, 6)
 * Result: [2, 2, 4, 3, 5, 9, 7]
 * 
 * @param {*} array the array to be sorted.
 * @param {*} left the start index of sub-array in whole array.
 * @param {*} right the end index of sub-array in whole array.
 * 
 * @returns the pivot index
 */
const partition = function (array, left, right) {
  if (!Array.isArray(array) || array.length < left || array.length < right) {
    return PARTITION_ERROR;
  }
  let index = left;
  let pivot = array[index];

  CommonUtil.swap(array, index, right);
  for (let i = left; i < right; i++) {
    if (array[i] < pivot) {
      CommonUtil.swap(array, index++, i);
    }
  }
  CommonUtil.swap(array, right, index);

  return index;
};

/**
 * Getting n biggest numbers from unsorted array using quick sorting algorithm.
 * 
 * @param {*} array the array to be sorted.
 * @param {*} left the start index of sub-array in whole array.
 * @param {*} right the end index of sub-array in whole array.
 * @param {*} n 
 */
const getBiggestNumbersByQSort = function(array, left, right, n) {
  if (!Array.isArray(array) || left >= right || n < 1) {
    return;
  }

  const index = partition(array, left, right);

  if (index === PARTITION_ERROR) { 
    return;
  }

  if (index > array.length - n) {
    getBiggestNumbersByQSort(array, left, index - 1, n);
  }
  getBiggestNumbersByQSort(array, index + 1, right, n);
};

module.exports = {
  getBiggestNumbersByQSort
};