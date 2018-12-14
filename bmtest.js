const fs = require('fs');
const readline = require('readline');
const MyBMA = require('./src/pattern-matching/MyBoyerMooreAlgorithm');
const CommonUtil = require('./src/utils/common.util');

const myBMTest = function() {
  const pattern = ' every ';
  const input =
    'Gen 1:12 And grass came up on the earth, and every plant producing seed of its sort, and every tree producing fruit, in which is its seed, of its sort: and God saw that it was good.';

  console.log(`input: ${input}, pattern: ${pattern}`);
  console.log(
    `Boyer Moore Algorithm Pattern Matching Result: ${JSON.stringify(
      MyBMA.bmSearching(` ${input} `, pattern, true)
    )}`
  );
};

myBMTest();
