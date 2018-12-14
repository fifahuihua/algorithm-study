/************************************************************************
 * Author:      Antony Zhang
 * Created:     2018-12-11
 * Description: This file is a customized Boyer-Moore algorithm to pattern
 *              matching words.
 ***********************************************************************/

// All the symbols to split words in sentence.
const SENTENCE_SYMBOLS = ',;.!"?:';

/**
 * Generate the bad character rules of pattern.
 * Example: pattern ==> TPABXAB
 *          Bad character rules ==> 
 *          {
 *            "T": [0], 
 *            "P": [1], 
 *            "A": [2, 5], 
 *            "B": [3, 6], 
 *            "X": [4]
 *          }
 * 
 * @param {*} pattern 
 */
const generateBadCharacterRule = function (pattern) {
  let bcr = {};

  if (!pattern) {
    return bcr;
  }

  for (let i = 0; i < pattern.length; i++) {
    bcr[pattern[i]] = bcr[pattern[i]] || [];
    bcr[pattern[i]].push(i);
  }

  return bcr;
};

/**
 * Generate the good suffix rules of pattern.
 * 
 * Example: pattern ==> TPABXAB
 *          Good suffix rules ==> [7,7,7,7,3,3,0]
 * 
 * @param {*} pattern 
 */
const generateGoodSuffixRule = function(pattern) {
  let gsr = [];

  if (!pattern) {
    return gsr;
  }

  gsr[pattern.length - 1] = 0; // the jump num of last char is 0. 
  const patternK = getPatternK(pattern);
  const middleIndex = Math.floor(pattern.length / 2);

  for (let i = 0; i < pattern.length - 1; i++) {
    gsr[i] = pattern.length - patternK;
  }

  for (let i = pattern.length - 2; i >= middleIndex; i--) {
    gsr[i] = pattern.length - patternK;
    let suffix = pattern.substring(i + 1);
    for (let j = i - suffix.length + 1; j > 0; j--) {
      if (pattern.substring(j, j + suffix.length) === suffix) {
        gsr[i] = i - j + 1;
        break;
      }
    }
  }

  return gsr;
};

/**
 * Getting the length of same suffix and prefix of pattern. 
 * We name it as K of pattern.
 * 
 * For example: 
 *  Pattern: TPABXAB  ==> K of pattern is 0.
 *  Pattern: abcdeab  ==> K of pattern is 2, because the prefix "ab" equals the suffix "ab"
 * 
 * @param {*} pattern 
 */
const getPatternK = function(pattern) {
  if (!pattern) {
    return 0;
  }

  let k = 0;
  for (let i = 0; i < pattern.length; i++) {
    let j = pattern.length - 1 - i;
    // console.log(`i=${i}, j=${j}, pattern.substring(0, ${i + 1})=${pattern.substring(0, i + 1)},pattern.substring(${j})=${pattern.substring(j)}`);
    if (pattern.substring(0, i + 1) === pattern.substring(j)) {
      k = i + 1;
    }

    if (i >= j) {
      break;
    }
  }

  return k;
};

/**
 * Check if two chars are equal.
 * 
 * Examples: 
 *    c1="a", c2="b"  ==> false
 *    c1="a", c2="A"  ==> true
 *    c1=".", c2=" "  ==> true
 *    c1=" ", c2="."  ==> false   // In fact, no this case happens.
 * 
 * @param {*} c1 the char in input text.
 * @param {*} c2 the char in pattern, so c2 will not contain symbols in SENTENCE_SYMBOLS.
 */
const isSameChar = function (c1, c2) { 
  if (c1 === c2) { 
    return true;
  }

  if (!c1 || !c2) { 
    return false;
  }

  if (SENTENCE_SYMBOLS.indexOf(c1) !== -1) { 
    c1 = ' ';
  }

  return c1.toLowerCase() === c2.toLowerCase();
}

/**
 * The implement of Boyer-Moore algorithm.
 * 
 * @param {*} input the input string to be matched.
 * @param {*} pattern the match pattern
 * @param {*} needRepeat is multiple matching?
 */
const bmSearching = function(input, pattern, multiple) {
  if (!input || !pattern || input.length < pattern.length) {
    return multiple ? [] : -1;
  }

  const bcr = generateBadCharacterRule(pattern);
  const gsr = generateGoodSuffixRule(pattern);

  // curIndex is the index of input string, start at pattern.length - 1.
  let curIndex = pattern.length - 1; 
  
  let matchedIndexes = [];

  while (curIndex < input.length) {
    let jumpSize = 0;
    let unmatchIndex = -1;

    for (let i = 0; i < pattern.length; i++) {
      // found not matched char, break and start to jump.
      if (!isSameChar(input[curIndex - i], pattern[pattern.length - 1 - i])) {
        unmatchIndex = pattern.length - 1 - i;
        break;
      }
    }

    if (unmatchIndex === -1) { // matched!!!
      let matchedIndex = curIndex - pattern.length + 1;
      if (!multiple) {
        return matchedIndex;
      } else {
        matchedIndexes.push(matchedIndex);
        curIndex += pattern.length; // jump
      }
    } else { // not matched
      const bcrJumpSizes = bcr[pattern[unmatchIndex]];  // Read the bad charater rules to get jump num.
      if (!bcrJumpSizes) { // not found, then jump num is pattern length (the case of -1 in ppt).
        jumpSize = pattern.length;
      } else {
        jumpSize = gsr[unmatchIndex]; // Read the good suffix rules to get jump num.
        const brcJumpSize = unmatchIndex - bcrJumpSizes[bcrJumpSizes.length - 1]; 
        if (brcJumpSize > jumpSize) { // use the max jump num of bcr and gsr.
          jumpSize = brcJumpSize;
        }
      }

      jumpSize = jumpSize || 1; // if jump size is 0, force to move at lease one.

      curIndex += jumpSize;
    }
  }

  return matchedIndexes;
};

module.exports = {
  bmSearching
};

