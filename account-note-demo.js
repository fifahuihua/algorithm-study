const fs = require('fs');
const readline = require('readline');
const AccountNotes = require('./src/account-notes');
const NumberUtil = require('./src/account-notes/ChineseNumUtil');
const TimeUtil = require('./src/account-notes/ChineseTimeUtil');

const demo = function() {
  const fileStream = fs.createReadStream(__dirname + '/src/files/events.txt');
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  // 统计结果Cache
  const accountNotes = {};

  rl.on('line', lineText => {
    if (!lineText || lineText.startsWith('-')) {
      console.log('**************************************');
      return;
    }

    const timeType = AccountNotes.getTimeType(lineText);
    const eventType = AccountNotes.getEventType(lineText);
    if (!timeType) {
      console.log(`${lineText} ===> 暂时找不到时间类别，忽略～`);
      return;
    }

    // Case: Current input is a question.
    if (AccountNotes.isQuestion(lineText)) {
      const questionType = AccountNotes.getQuestionType(lineText);
      if (!questionType) {
        console.log(`${lineText} ===> 暂时找不到问题类别，忽略～`);
        return;
      }
      const value = (accountNotes[timeType] || {})[eventType || '消费'];
      console.log(
        `${lineText} ===> ${
          questionType === AccountNotes.PRICE_TYPE
            ? value
            : TimeUtil.formatTime2Str(value)
        }${questionType === AccountNotes.PRICE_TYPE ? '元' : ''}`
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
      AccountNotes.eventTypesInfo[eventType].unitType ===
      AccountNotes.PRICE_TYPE;
    accountNotes[timeType] = accountNotes[timeType] || {};
    accountNotes[timeType][eventType] = accountNotes[timeType][eventType] || 0;
    const value = AccountNotes.getEventValue(lineText, eventType);
    accountNotes[timeType][eventType] += value;

    console.log(
      `${lineText} ===> ${timeType} | ${eventType} | ${
        isPriceType ? value : TimeUtil.formatTime2Str(value)
      }`
    );
  });

  rl.on('close', () => {
    // TODO
  });
};

demo();
