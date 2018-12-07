/********************************************************************
 * Author:      Antony Zhang
 * Created:     2018-12-07
 * Description: This util file contains some common util functions.
 *******************************************************************/

/**
 * Swap two item values in array.
 * Assumption: array: [1, 2, 3, 4] and swap(arr, 1, 3).
 * Result: array[1] = 4 and array[3] = 2.
 *
 * @param {*} array
 * @param {*} i
 * @param {*} j
 */
const swap = function(array, i, j) {
  if (!Array.isArray(array) || array.length <= i || array.length <= j) {
    return;
  }

  const tempV = array[i];
  array[i] = array[j];
  array[j] = tempV;
};

/**
 * This function is for pretty print array values by rows.
 *
 * @param {*} array the array need to be printed.
 * @param {*} start the start index
 * @param {*} end the end index
 * @param {*} oneRowSize the number of values in one row.
 */
const prettyReversePrint = function(array, start, end, oneRowSize) {
  if (!Array.isArray(array)) {
    return;
  }

  for (let i = end; i >= start; i--) {
    process.stdout.write(`${array[i]}${i > start ? ", " : ""}`);
    if (i % oneRowSize === 0) {
      console.log();
    }
  }
  console.log();
};

module.exports = {
  swap, prettyReversePrint
};
