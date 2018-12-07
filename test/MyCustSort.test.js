const assert = require("assert");
const MyCustSort = require('../src/sorting/MyCustSort');

describe("MyCustSort", function() {
  describe("getBiggestNumbers", function() {
    it("should return empty array when pass invalid parameter.", function() {
      assert.deepEqual(MyCustSort.getBiggestNumbers('This is not an array', 3), []);
      assert.deepEqual(MyCustSort.getBiggestNumbers([4, 7, 2], -1), []);
    });

    it("should return sorted array with some 0 itmes when passed array size is less than n.", function() {
      assert.deepEqual(MyCustSort.getBiggestNumbers([4, 7, 2], 5), [0, 0, 2, 4, 7]);
    });

    it("should return sorted array when passed unsorted array.", function() {
      assert.deepEqual(MyCustSort.getBiggestNumbers([9, 1, 4, 8, 6, 2, 8, 1, 2], 3), [8, 8, 9]);
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

      assert.deepEqual(MyCustSort.getBiggestNumbers(testDataArray, LARGEST_N), expected_array);
    });
  });
});
