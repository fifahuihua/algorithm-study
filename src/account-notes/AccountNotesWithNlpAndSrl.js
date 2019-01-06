const axios = require('axios');
const AccountNotesUtil = require('./AccountNotesUtil');
const ChineseNumUtil = require('./ChineseNumUtil');
const ChineseTimeUtil = require('./ChineseTimeUtil');

const timeRegex = /<START:TIM>(.)+<END>/g;
const timeReplaceRegex = /(<START:TIM>)|(<END>)/g;
const PRICE_PATTERN = /^[零一二三四五六七八九壹贰叁肆伍陆柒捌玖两亿万千仟佰百十拾点块元毛角分\d.整]+(元)?$/g;
const TIME_PATTERN = /^[零一二三四五六七八九壹贰叁肆伍陆柒捌玖两亿万千仟佰百十拾点分\d.半整小时分钟秒天]+(小时|分钟|分|秒|天)$/g;

/**
 * Call Emotibot API with axios.
 *
 * @param {*} cmd getNlp or getSrl or checkTextAnalyze
 * @param {*} text the text need to be analysised.
 */
const _request = async function(cmd, text) {
  try {
    const res = await axios.post(
      'http://idc.emotibot.com/api/ApiKey/openapi.php',
      `cmd=${cmd}&appid=5a200ce8e6ec3a6506030e54ac3b970e&userid=0B789C68DEF466423B55BF03682DE2623&text=${text}`
    );

    return res.data.data[0];
  } catch (error) {
    console.log(error);
    return null;
  }
};

/**
 * Get the time type from the namedEntities of the NLP API response.
 *
 * @param {*} namedEntities
 */
const getTimeType = function(namedEntities) {
  if (!namedEntities) {
    return AccountNotesUtil.DEFAULT_TIME_TYPE;
  }

  const matchResult = namedEntities.match(timeRegex);
  if (matchResult) {
    for (let item of matchResult) {
      const timeStr = item.replace(timeReplaceRegex, '');
      for (let keyword of AccountNotesUtil.keywordsForTime) {
        if (timeStr.includes(keyword)) {
          return keyword;
        }
      }
    }
  }

  return AccountNotesUtil.DEFAULT_TIME_TYPE;
};

/**
 * Get the event value
 *
 * @param {*} text
 * @param {*} eventType
 * @param {*} srlAtpOrTmp the ATP or TMP of SRL API result.
 */
const getEventValue = function(text, eventType, srlAtpOrTmp) {
  if (!text || !eventType || !srlAtpOrTmp) {
    return 0;
  }

  // Only the consumer event type to use money unit.
  const unitType = AccountNotesUtil.eventTypesInfo[eventType].unitType;
  let isTimeUnit = false;
  if (unitType === AccountNotesUtil.TIME_TYPE) {
    isTimeUnit = true;
  }

  for (let atpOrTmp of srlAtpOrTmp) {
    for (let key in atpOrTmp) {
      if (!text.includes(key)) {
        continue;
      }
      let matchResult = atpOrTmp[key].match(
        isTimeUnit ? TIME_PATTERN : PRICE_PATTERN
      );
      if (matchResult && matchResult.length > 0) {
        return isTimeUnit
          ? ChineseTimeUtil.convertStr2Time(matchResult[0])
          : ChineseNumUtil.convert2Num(matchResult[0]);
      }
    }
  }

  let matchResult = text.match(
    isTimeUnit ? AccountNotesUtil.TIME_PATTERN : AccountNotesUtil.PRICE_PATTERN
  );
  if (!matchResult) {
    return 0;
  }
  // fetch only the num string and remove the words for fetching out the money num string.
  const matchedValueStr = matchResult[0].replace(/(花了|用了|花|消费|元)/g, '');

  return isTimeUnit
    ? ChineseTimeUtil.convertStr2Time(matchedValueStr)
    : ChineseNumUtil.convert2Num(matchedValueStr);
};

/**
 * Get the event type by analysising the keywords of the response of calling NLP API.
 *
 * @param {*} text the line text
 * @param {*} keywords the keywords from the response of NLP API.
 */
const getEventType = function(text, keywords) {
  if (!keywords || keywords.length === 0 || !text) {
    return AccountNotesUtil.DEFAULT_EVENT_TYPE_OTHERS;
  }

  for (let keyword of keywords) {
    for (let eventType in AccountNotesUtil.eventTypesInfo) {
      const keywords = AccountNotesUtil.eventTypesInfo[eventType].keywords;
      if (keywords.includes(keyword)) {
        return eventType;
      }
    }
  }

  return text.match(AccountNotesUtil.TIME_PATTERN)
    ? AccountNotesUtil.DEFAULT_EVENT_TYPE_OTHERS
    : AccountNotesUtil.DEFAULT_EVENT_TYPE_CONSUME;
};

/**
 * Analysis the input text by calling NLP and SRL API.
 *
 * @param {*} text
 */
const analysisText = async function(text) {
  try {
    const result = await _request('getNlp', text);
    const timeType = getTimeType(result.namedEntities);
    const keywords = getLevel1Keywords(result.keyword);

    const srlResult = await _request('getSrl', text);
    const srlTmp = srlResult.srl.srl.TMP;
    const srlAtp = srlResult.srl.srl.ATP;
    const eventType = getEventType(text, keywords);
    const eventValue = getEventValue(text, eventType, srlAtp || srlTmp);

    return {
      eventType,
      timeType,
      eventValue
    };
  } catch (error) {
    console.log(error);
    return null;
  }
};

/**
 * Getting the keywords of top 1 level.
 *
 * @param {*} arr
 */
const getLevel1Keywords = function(arr) {
  if (!arr || !Array.isArray(arr)) {
    return [];
  }

  let keywords = [];
  for (let item of arr) {
    if (item.level === '1') {
      keywords.push(item.word);
    }
  }

  return keywords;
};

module.exports = {
  analysisText
};
