const fs = require('fs');
const readline = require('readline');

const answer = '弗兰克·德拉邦特';
const sorryAnswer = '对不起，我暂时不知道。';
const minEnsureScore = 75; // The min score to ensure the text is for asking the director of movie.
const minEnsureScoreForMatching = 90; // The min score to ensure the text is for asking the director of movie just by extact matching.
const matchPatterns = [
  /(我想知道)?《?肖申克的救赎》?的?导演(是谁|叫什么名字(来着|啊|呀)?)？?/g,
  /(谁是|我想知道)《?肖申克的救赎》?的?导演/g
];

/**
 * The keywords for question, and its score.
 * total the score should be 100.
 */
const keywordsPatterns = [
  { pattern: /[肖消销萧][申深伸参呻砷生][克客刻]/g, score: 25 },
  { pattern: /的?救赎/g, score: 25 },
  { pattern: /导演/g, score: 50 }
];

/**
 * The wrong cases for matching.
 * Matched any case, then we can ensure this sentence is not for asking the director name.
 */
const wrongCasePatterns = [
  /导演的(?!(名字|肖申克的救赎))/g,
  /不想?知道/g,
  /不(是谁|叫什么名字)/g,
  /我不(.+)(导演|肖申克的救赎)/g
];

/**
 * Get the matching score by exact matching.
 *
 * @param {*} text
 */
const getTextMatchScore = function(text) {
  if (!text) {
    return 0;
  }

  let score = 0;
  const textLength = text.length;
  for (let pattern of matchPatterns) {
    const matchResults = text.match(pattern);
    if (matchResults && matchResults.length > 0) {
      for (let result of matchResults) {
        const matchScore = parseFloat(
          ((result.length / textLength) * 100).toFixed(2)
        );
        score = matchScore > score ? matchScore : score;
      }
    }
  }

  return score;
};

/**
 * Get the max matched string length.
 *
 * @param {*} matchedResult
 */
const getMatchedLength = function(matchedResult) {
  if (!matchedResult) {
    return 0;
  }

  let length = 0;
  for (let m of matchedResult) {
    if (m.length > length) {
      length = m.length;
    }
  }

  return length;
};

/**
 * Get the score by matching keywords.
 * Final score = score of keyword matching * 60% + matched string length percentage * 100 * 40%;
 *
 * @param {*} text
 */
const getScoreOfKeywords = function(text) {
  if (!text) {
    return null;
  }

  let score = 0;
  let matchedLength = 0;
  for (let keywordPattern of keywordsPatterns) {
    const matchedResult = text.match(keywordPattern.pattern);
    if (matchedResult) {
      score += keywordPattern.score;
      matchedLength += getMatchedLength(matchedResult);
    }
  }

  // console.log(
  //   `score: ${score}, matchedLength: ${matchedLength}, text.length: ${
  //     text.length
  //   }`
  // );
  return parseFloat(
    (score * 0.6 + (40 * matchedLength) / text.length).toFixed(2)
  );
};

/**
 * Valid if there is words of wrong cases.
 *
 * @param {*} text
 */
const hasWrongCase = function(text) {
  if (!text) {
    return false;
  }

  for (let p of wrongCasePatterns) {
    if (text.match(p)) {
      return true;
    }
  }
};

/**
 * Calcuate the final score.
 *
 * @param {*} text
 */
const getFinalMatchScore = function(text) {
  if (!text) {
    return 0;
  }

  const textMatchScore = parseFloat(getTextMatchScore(text));
  if (textMatchScore >= minEnsureScoreForMatching) {
    return textMatchScore;
  }

  if (hasWrongCase(text)) {
    return 0;
  }
  const keywordMatchScore = getScoreOfKeywords(text);

  // console.log(
  //   `keywordMatchScore=${keywordMatchScore}, textMatchScore=${textMatchScore}, (keywordMatchScore + textMatchScore) / 2 : ${(keywordMatchScore +
  //     textMatchScore) /
  //     2}`
  // );
  // return parseFloat(((keywordMatchScore + textMatchScore) / 2).toFixed(2));
  return keywordMatchScore;
};

const testInput = function() {
  const fileStream = fs.createReadStream(__dirname + '/src/files/input2.txt');
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  const start = Date.now();

  rl.on('line', lineText => {
    if (!lineText || lineText.startsWith('-')) {
      console.log('**************************************');
      return;
    }
    const score = getFinalMatchScore(lineText);
    console.log(
      `${lineText} (分数：${score})  ===> ${
        score > minEnsureScore ? answer : sorryAnswer
      }`
    );
  });

  rl.on('close', () => {
    // TODO
  });
};

testInput();
