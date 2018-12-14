const fs = require('fs');
const readline = require('readline');
const MyCustSort2 = require('./src/sorting/MyCustSortForObjectArray');
const CommonUtil = require('./src/utils/common.util');

const myPatternMatchingAlgorithmTest = async function() {
  const patterns = await CommonUtil.getPatterns();
  let lineNum = 0;
  const maxMatchedWordsLength = 500;

  const fileStream = fs.createReadStream(__dirname + '/src/files/bbe.txt');
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  const start = Date.now();
  rl.on('line', line => {
    lineNum++;

    const words = line.split(/\s*[.,!?:;\s]\s*/);
    for (let word of words) {
      // ignore the empty word.
      if (word) {
        word = word.toLowerCase();
        if (patterns[word]) {
          patterns[word].totalMatched = patterns[word].totalMatched + 1;
          patterns[word].matchedLines[lineNum] =
            patterns[word].matchedLines[lineNum] || 0;
          patterns[word].matchedLines[lineNum] =
            patterns[word].matchedLines[lineNum] + 1;
        }
      }
    }
  });

  rl.on('close', () => {
    const maxMatchedWords = MyCustSort2.getBiggestNumbers(
      patterns,
      maxMatchedWordsLength
    );
    console.log(`Time Cost: ${Date.now() - start} ms`);
    console.log(`The words of first 500 max matched times: `);
    for (let i = maxMatchedWordsLength - 1; i > 0; i--) {
      const wordInfo = maxMatchedWords[i] || { result: {} };
      console.log(`"${wordInfo.word}" ==> ${wordInfo.result.totalMatched}`);
      //  Matched in Lines: [${Object.keys(wordInfo.result.matchedLines)}]
    }
  });
};

myPatternMatchingAlgorithmTest();
