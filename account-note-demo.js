const fs = require('fs');
const readline = require('readline');
const AccountNotesUtil = require('./src/account-notes/AccountNotesUtil');
const NumberUtil = require('./src/account-notes/ChineseNumUtil');
const TimeUtil = require('./src/account-notes/ChineseTimeUtil');
const CommonUtil = require('./src/utils/common.util');

const analysisText = function(lineText, accountNotes) {
  if (!lineText || lineText.startsWith('-')) {
    console.log('**************************************');
    return;
  }

  const timeType = AccountNotesUtil.getTimeType(lineText);
  const eventType = AccountNotesUtil.getEventType(lineText);
  if (!timeType) {
    console.log(`${lineText} ===> 暂时找不到时间类别，忽略～`);
    return;
  }

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

  if (!eventType) {
    console.log(`${lineText} ===> 暂时找不到事件类别，忽略～`);
    return;
  }

  const isPriceType =
    AccountNotesUtil.eventTypesInfo[eventType].unitType ===
    AccountNotesUtil.PRICE_TYPE;
  accountNotes[timeType] = accountNotes[timeType] || {};
  accountNotes[timeType][eventType] = accountNotes[timeType][eventType] || 0;
  const value = AccountNotesUtil.getEventValue(lineText, eventType);
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
    analysisText(lineText, accountNotes);
  }
};

demo();
