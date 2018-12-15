const fs = require('fs');
const readline = require('readline');
const AhoCorasick = require('./src/pattern-matching//CustomAhoCorasick');
const MyCustSort2 = require('./src/sorting/MyCustSortForObjectArray');
const CommonUtil = require('./src/utils/common.util');

const AhoCorasickTest = async function() {
  // get patterns from dict.txt
  const patterns = await CommonUtil.getPatterns();
  let words = [];
  let lineNum = 0;
  const maxMatchedWordsLength = 500;
  const fileStream = fs.createReadStream(__dirname + '/src/files/bbe.txt');
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  for (let pattern in patterns) {
    words.push(` ${pattern} `);
  }

  const ac = new AhoCorasick(words);
  const start = Date.now();
  rl.on('line', lineText => {
    lineNum++;
    if (!lineText) {
      return;
    }

    lineText = lineText.toLowerCase();

    // adding space before and after line to avoid not matching the first and last word.
    const matchResults = ac.search(` ${lineText} `);

    for (let result of matchResults) {
      for (let word of result[1]) {
        // ignore the empty word.
        if (word) {
          word = word.trim();
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
    }
  });

  rl.on('close', () => {
    console.log(`Time Cost of Aho-Corasick: ${Date.now() - start} ms`);
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

AhoCorasickTest();
