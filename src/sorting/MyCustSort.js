/************************************************************************
 * Author:      Antony Zhang
 * Created:     2018-12-07
 * Description: This files is an algorithm to get n biggest numbers
 *              from an unsorted array. The unsorted array size maybe 
 *              is very large. 
 * Design:      1. Define an empty array (sortedAray) with n size and 
 *                 initialize all items to 0.
 *              2. Go through the items of unsorted array, add current 
 *                 item into sortedArray with correct index if it is 
 *                 bigger then sortedArray[0]
 *              3. return sortedArray.
 * 
 * Assumption:  array = [8, 4, 6, 7, 2, 5, 2, 7], n = 3
 * Expected:    [7, 7, 8] 
 ***********************************************************************/

const CommonUtil = require("../utils/common.util");

/**
 * Getting n biggest numbers from unsorted array.
 *
 * @param {*} array unsorted array
 * @param {*} n
 * @returns sorted array with n biggest numbers.
 */
const getBiggestNumbers = function (array, n) {
  if (!Array.isArray(array) || n <= 0) { 
    return [];
  }
  
  let sortedArray = [];
  for (let i = 0; i < n; i++) {
    sortedArray[i] = 0;
  }

  for (let i = 0; i < array.length; i++) {
    let smallestValue = sortedArray[0];

    if (array[i] > smallestValue) {
      insertValue(sortedArray, array[i]);
    }
  }

  return sortedArray;
};

/**
 * Insert v into the correct index in current ordered array.
 *
 * @param {*} array ordered array.
 * @param {*} v
 */
const insertValue = function(array, v) {
  for (let i = 1; i < array.length; i++) {
    if (array[i] >= v || i === array.length - 1) {
      array[0] = v;
      let endIndex = i;

      // If all the items is less than v, then the endIndex should be array length.
      if (i === array.length - 1 && array[i] < v) {
        endIndex = array.length;
      }

      for (let j = 1; j < endIndex; j++) {
        CommonUtil.swap(array, j, j - 1);
      }
      return;
    }
  }
};

module.exports = {
  getBiggestNumbers
};
