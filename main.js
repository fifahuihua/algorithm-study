const MyCustSort = require('./src/sorting/MyCustSort');
const MyQSort = require('./src/sorting/MyQSort');
const CommonUtil = require('./src/utils/common.util');

const ARRAY_LENGTH = 3000 * 10000;
const MAX_NUM = 10 * 10000 * 10000;
const LARGEST_N = 100;
const ROW_SIZE = 10;

let testDataArray = [];

const initAarry = function() {
  for (let i = 0; i < ARRAY_LENGTH; i++) {
    testDataArray[i] = Math.round(Math.random() * MAX_NUM);
  }
};

const main = function() {
  initAarry();
  console.log("============= start demo =============");
  let start = Date.now();

  // this code will not update items of testDataArray.
  const biggestNumbers = MyCustSort.getBiggestNumbers(testDataArray, LARGEST_N);

  console.log(`My Customized Algorithm Time cost: ${Date.now() - start} ms`);
  console.log(`The biggest ${LARGEST_N} values in array: `);
  CommonUtil.prettyReversePrint(biggestNumbers, 0, biggestNumbers.length - 1, ROW_SIZE);

  start = Date.now();

  // this code will update items of testDataArray!!!!
  MyQSort.getBiggestNumbersByQSort(testDataArray, 0, testDataArray.length - 1, LARGEST_N);

  console.log(`Improved QSort Algorithm Time cost: ${Date.now() - start} ms`);
  console.log(`The biggest ${LARGEST_N} values in array: `);
  CommonUtil.prettyReversePrint(testDataArray, testDataArray.length - LARGEST_N, testDataArray.length - 1, ROW_SIZE);
};

main();