const fs = require('fs');
const readline = require('readline');
const MyBMA = require('./src/pattern-matching/MyBoyerMooreAlgorithm');
const MyCustSort2 = require('./src/sorting/MyCustSortForObjectArray');
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

const myBMTest2 = async function() {
  let lineNum = 0;
  // get patterns from dict.txt
  const patterns = await CommonUtil.getPatterns('dict2.txt');

  const fileStream = fs.createReadStream(__dirname + '/src/files/bbe.txt');
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  const start = Date.now();

  rl.on('line', lineText => {
    lineNum++;
    if (!lineText) {
      return;
    }

    for (let pattern in patterns) {
      const matchedIndexes = MyBMA.bmSearching(
        ` ${lineText} `,
        ` ${pattern} `,
        true
      );
      if (matchedIndexes.length > 0) {
        // found word, then count++
        patterns[pattern].totalMatched =
          patterns[pattern].totalMatched + matchedIndexes.length;

        // record the matched line num for this word.
        patterns[pattern].matchedLines[lineNum] = matchedIndexes.length;
      }
    }
  });

  rl.on('close', () => {
    console.log(`Time Cost of Boyer-Moore Alogirthm: ${Date.now() - start} ms`);
    const maxMatchedWords = MyCustSort2.getBiggestNumbers(
      patterns,
      Object.keys(patterns).length
    );
    console.log(`Total Time Cost: ${Date.now() - start} ms`);
    console.log(
      `The words of first ${maxMatchedWords.length} max matched times: `
    );
    CommonUtil.prettyReversePrintObject(
      maxMatchedWords,
      0,
      maxMatchedWords.length - 1,
      10
    );
  });
};

myBMTest2();
