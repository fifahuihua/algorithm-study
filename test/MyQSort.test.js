const assert = require("assert");
const MyQSort = require('../src/sorting/MyQSort');

describe("MyQSort", function() {
  describe("getBiggestNumbersByQSort", function() {
    it("should return empty array when pass invalid parameter.", function () {
      let array = [6, 21, 4, 66, 2, 11, 4];
      let arrayExpected = [6, 21, 4, 66, 2, 11, 4];
      let notArray = 'This is not an array.';
      let notArrayExpected = 'This is not an array.';

      MyQSort.getBiggestNumbersByQSort(notArray, 0, notArray.length - 1, 2);
      assert.equal(notArray, notArrayExpected);

      MyQSort.getBiggestNumbersByQSort(array, 11, 1, 2)
      assert.deepEqual(array, arrayExpected);

      MyQSort.getBiggestNumbersByQSort(array, 0, array.length - 1, -1)
      assert.deepEqual(array, arrayExpected);
    });

    it("should return partly sorted array when passed unsorted array.", function () {
      let array = [9, 1, 4, 8, 6, 2, 8, 1, 2];
      let arrayExpected = [1, 1, 2, 4, 6, 2, 8, 8, 9];
      MyQSort.getBiggestNumbersByQSort(array, 0, array.length - 1, 3);
      assert.deepEqual(array, arrayExpected);
    });

    it("should handler correctly when passed a big big big array.", function () {
      const ARRAY_LENGTH = 3000 * 10000;
      const MAX_NUM = 100000;
      const LARGEST_N = 5;
      const expected_array = [100001, 100002, 100003, 100004, 100005];

      let testDataArray = [];
      for (let i = 0; i < ARRAY_LENGTH; i++) {
        testDataArray[i] = Math.round(Math.random() * MAX_NUM);
      }

      // repeat some items randomly.
      testDataArray[0] = expected_array[1];
      testDataArray[123] = expected_array[4];
      testDataArray[12345] = expected_array[3];
      testDataArray[23456] = expected_array[2];
      testDataArray[12345678] = expected_array[0];

      MyQSort.getBiggestNumbersByQSort(testDataArray, 0, ARRAY_LENGTH - 1, LARGEST_N);
      assert.equal(testDataArray[ARRAY_LENGTH - 1], expected_array[4]);
      assert.equal(testDataArray[ARRAY_LENGTH - 2], expected_array[3]);
      assert.equal(testDataArray[ARRAY_LENGTH - 3], expected_array[2]);
      assert.equal(testDataArray[ARRAY_LENGTH - 4], expected_array[1]);
      assert.equal(testDataArray[ARRAY_LENGTH - 5], expected_array[0]);
    });
  });
});
