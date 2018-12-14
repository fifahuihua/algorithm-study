/************************************************************************
 * Author:      Antony Zhang
 * Created:     2018-12-07
 * Description: This files is an algorithm to get n biggest numbers
 *              from an unsorted object array.
 * Design:      1. Define an empty array (sortedAray) with n size and
 *                 initialize all items to null or empty.
 *              2. Go through the items of unsorted object array, add current
 *                 item into sortedArray with correct index if it is
 *                 bigger then sortedArray[0]
 *              3. return sortedArray.
 ***********************************************************************/

const CommonUtil = require("../utils/common.util");

/**
 * Getting n biggest numbers from unsorted array.
 *
 * @param {*} array unsorted array
 * @param {*} n
 * @returns sorted array with n biggest numbers.
 */
const getBiggestNumbers = function(patterns, n) {
  if (!patterns || n <= 0) {
    return [];
  }

  let sortedObjectArray = [];
  sortedObjectArray[n - 1] = null;

  for (let word in patterns) {
    const firstItem = sortedObjectArray[0] || { result: { totalMatched: 0 } };
    let smallestValue = firstItem.result.totalMatched;

    if (patterns[word].totalMatched > smallestValue) {
      insertValue(sortedObjectArray, { word: word, result: patterns[word] });
    }
  }

  return sortedObjectArray;
};

/**
 * Insert v into the correct index in current ordered array.
 *
 * @param {*} array ordered array.
 * @param {*} v
 */
const insertValue = function (array, objectItem) {
  array[0] = objectItem;
  const totalMatched = objectItem.result.totalMatched;
  for (let i = 1; i < array.length; i++) {
    const curTotalMatched = (array[i] || { result: { totalMatched: 0 } }).result.totalMatched;
    if (curTotalMatched >= totalMatched || i === array.length - 1) {
      let endIndex = i;

      // If all the items is less than v, then the endIndex should be array length.
      if (i === array.length - 1 && curTotalMatched < totalMatched) {
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
