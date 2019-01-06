const fs = require('fs');
const readline = require('readline');
const AccountNotesUtil = require('./src/account-notes/AccountNotesUtil');
const AccountNotesWithApi = require('./src/account-notes/AccountNotesWithNlpAndSrl');
const NumberUtil = require('./src/account-notes/ChineseNumUtil');
const TimeUtil = require('./src/account-notes/ChineseTimeUtil');
const CommonUtil = require('./src/utils/common.util');

/**
 * Analysis the line text of file and save its value into the cache statistics object: accountNotes.
 *
 * @param {*} lineText
 * @param {*} accountNotes
 */
const analysisText = async function(lineText, accountNotes) {
  if (!lineText || lineText.startsWith('-')) {
    console.log('**************************************');
    return;
  }

  const result = await AccountNotesWithApi.analysisText(lineText);
  if (!result) {
    console.log(`${lineText} ===> 暂时无法分析该句子，忽略～`);
    return;
  }
  const eventType = result.eventType;
  const timeType = result.timeType;

  // Case: Current input is a question.
  if (AccountNotesUtil.isQuestion(lineText)) {
    const questionType = AccountNotesUtil.getQuestionType(lineText);
    if (!questionType) {
      console.log(`${lineText} ===> 暂时找不到问题类别，忽略～`);
      return;
    }
    const value = (accountNotes[timeType] || {})[eventType || '消费'];
    console.log(
      `${lineText} ===> ${
        questionType === AccountNotesUtil.PRICE_TYPE
          ? value
          : TimeUtil.formatTime2Str(value)
      }${questionType === AccountNotesUtil.PRICE_TYPE ? '元' : ''}`
    );
    return;
  }

  // Other case: Input is not question.
  //////////////////////////////////////////////////////

  const isPriceType =
    AccountNotesUtil.eventTypesInfo[eventType].unitType ===
    AccountNotesUtil.PRICE_TYPE;
  accountNotes[timeType] = accountNotes[timeType] || {};
  accountNotes[timeType][eventType] = accountNotes[timeType][eventType] || 0;
  const value = result.eventValue || 0;
  accountNotes[timeType][eventType] += value;

  console.log(
    `${lineText} ===> ${timeType} | ${eventType} | ${
      isPriceType ? value + '元' : TimeUtil.formatTime2Str(value)
    }`
  );
};

const demo = async function() {
  // 统计结果Cache
  const accountNotes = {};

  const textLines = await CommonUtil.getTextLines('events.txt');
  for (let lineText of textLines) {
    await analysisText(lineText, accountNotes);
  }
};

demo();
