const fs = require('fs');
const readline = require('readline');
const MyCustSort2 = require('./src/sorting/MyCustSortForObjectArray');
const CommonUtil = require('./src/utils/common.util');

const myPatternMatchingAlgorithmTest = async function() {
  // get patterns from dict.txt
  const patterns = await CommonUtil.getPatterns();
  let lineNum = 0;
  const maxMatchedWordsLength = 500;
  let testLines = [];

  const fileStream = fs.createReadStream(__dirname + '/src/files/bbe.txt');
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  const start = Date.now();
  rl.on('line', line => {
    lineNum++;

    // Split line text to words.
    const words = line.split(/\s*[.,!?:;\s]\s*/);
    for (let word of words) {
      // ignore the empty word.
      if (word) {
        word = word.toLowerCase();
        if (patterns[word]) {
          // found word, then count++
          patterns[word].totalMatched = patterns[word].totalMatched + 1;

          // record the matched line num for this word.
          patterns[word].matchedLines[lineNum] =
            patterns[word].matchedLines[lineNum] || 0;
          patterns[word].matchedLines[lineNum] =
            patterns[word].matchedLines[lineNum] + 1;
        }
      }
    }
  });

  rl.on('close', () => {
    console.log(`Pattern Matching Time Cost: ${Date.now() - start} ms`);
    const maxMatchedWords = MyCustSort2.getBiggestNumbers(
      patterns,
      maxMatchedWordsLength
    );
    console.log(`Total Time Cost: ${Date.now() - start} ms`);
    console.log(`The words of first 500 max matched times: `);
    CommonUtil.prettyReversePrintObject(
      maxMatchedWords,
      0,
      maxMatchedWords.length - 1,
      10
    );
  });
};

myPatternMatchingAlgorithmTest();
