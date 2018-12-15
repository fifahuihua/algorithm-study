/********************************************************************
 * Author:      Antony Zhang
 * Created:     2018-12-07
 * Description: This util file contains some common util functions.
 *******************************************************************/

const fs = require('fs');
const readline = require('readline');

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
    process.stdout.write(`${array[i]}${i > start ? ', ' : ''}`);
    if (i % oneRowSize === 0) {
      console.log();
    }
  }
  console.log();
};

/**
 * This function is for pretty print array values of pattern matching results by rows.
 *
 * @param {*} array the array need to be printed.
 * @param {*} start the start index
 * @param {*} end the end index
 * @param {*} oneRowSize the number of values in one row.
 */
const prettyReversePrintObject = function(array, start, end, oneRowSize) {
  if (!Array.isArray(array)) {
    return;
  }

  for (let i = end; i >= start; i--) {
    process.stdout.write(`${array[i].word}: ${array[i].result.totalMatched}, `);
    if (i % oneRowSize === 0) {
      console.log();
    }
  }
  console.log();
};

/**
 * Reading file content line by line.
 */
const getPatternsFromFile = function(cb) {
  const patterns = {};
  const fileStream = fs.createReadStream(__dirname + '/../files/dict.txt');
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  rl.on('line', line => {
    const pattern = line.split(' ')[0];
    if (pattern) {
      patterns[pattern] = {
        totalMatched: 0,
        matchedLines: {}
      };
    }
  });

  rl.on('close', () => {
    cb(patterns);
  });
};

/**
 * Read the pattern words for the dict.txt file.
 */
const getPatterns = function() {
  return new Promise(function(resolve, reject) {
    getPatternsFromFile(function(patterns) {
      resolve(patterns);
    });
  });
};

module.exports = {
  swap,
  prettyReversePrint,
  prettyReversePrintObject,
  getPatterns
};
