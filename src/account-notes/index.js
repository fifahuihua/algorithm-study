const NumberUtil = require('./ChineseNumUtil');
const TimeUtil = require('./ChineseTimeUtil');

const PRICE_TYPE = 'PRICE';
const TIME_TYPE = 'TIME';
const DEFAULT_EVENT_TYPE_OTHERS = '其他';
const DEFAULT_EVENT_TYPE_CONSUME = '消费';
const DEFAULT_TIME_TYPE = '今天';
const PRICE_PATTERN = /(花了|用了|花|消费)[零一二三四五六七八九壹贰叁肆伍陆柒捌玖两亿万千仟佰百十拾点块元毛角分\d.半整]+(元)?/g;
const TIME_PATTERN = /(花了)?[零一二三四五六七八九壹贰叁肆伍陆柒捌玖两亿万千仟佰百十拾点块元毛角分\d.半整小时分钟秒天]+(小时|分钟|分|秒|天)/g;

const keywordsForQuestion = ['多少', '多久', '多长'];
const keywordsForTime = ['今天', '昨天', '前天', '上周'];
const eventTypesInfo = {
  消费: { keywords: ['买', '购物', '消费', '吃饭'], unitType: PRICE_TYPE },
  娱乐: { keywords: ['唱歌', '跳舞', '娱乐'], unitType: TIME_TYPE },
  学习: { keywords: ['学习', '看书', '读'], unitType: TIME_TYPE },
  运动: { keywords: ['运动', '跑步', '打球'], unitType: TIME_TYPE },
  其他: { keywords: [], unitType: TIME_TYPE }
};

const eventTypes = Object.keys(eventTypesInfo);

/**
 * Get event type of current input string.
 * Default event type is '消费' for money.
 * And default event type for others is '其他'.
 *
 * Example:
 *  input: 我昨天下午买菜花了一百二
 *  return: 消费
 *
 * @param {*} input
 */
const getEventType = function(input) {
  if (!input) {
    return null;
  }

  for (let type of eventTypes) {
    const keywords = eventTypesInfo[type].keywords;
    for (let keyword of keywords) {
      if (input.indexOf(keyword) !== -1) {
        return type;
      }
    }
  }

  if (input.match(TIME_PATTERN)) {
    return DEFAULT_EVENT_TYPE_OTHERS;
  }

  return input.match(PRICE_PATTERN) || input.indexOf('钱') !== -1
    ? DEFAULT_EVENT_TYPE_CONSUME
    : DEFAULT_EVENT_TYPE_OTHERS;
};

/**
 * Get time type of current input.
 *
 * Example:
 *  input: 我昨天下午买菜花了一百二
 *  return: 昨天
 *
 * @param {*} input
 */
const getTimeType = function(input) {
  if (!input) {
    return null;
  }

  for (let timeType of keywordsForTime) {
    if (input.indexOf(timeType) !== -1) {
      return timeType;
    }
  }

  return DEFAULT_TIME_TYPE;
};

/**
 * Judge current input is a question or not.
 *
 * @param {*} input
 */
const isQuestion = function(input) {
  if (!input) {
    return false;
  }

  for (let keyword of keywordsForQuestion) {
    if (input.indexOf(keyword) !== -1) {
      return true;
    }
  }

  return false;
};

/**
 * Get current event type is for price or time.
 *
 * @param {*} input
 */
const getQuestionType = function(input) {
  if (!input) {
    return null;
  }

  if (input.indexOf('钱') !== -1) {
    return PRICE_TYPE;
  }

  if (input.indexOf('时间') !== -1) {
    return TIME_TYPE;
  }

  return null;
};

/**
 * Fetch the event value intelligently.
 * Example:
 *  input: 我昨天下午买菜花了一百二
 *  return: 120
 *
 * @param {*} lineText
 * @param {*} eventType
 */
const getEventValue = function(lineText, eventType) {
  if (!lineText || !eventType) {
    return 0;
  }

  const unitType = (eventTypesInfo[eventType] || {}).unitType;
  if (!unitType) {
    return 0;
  }

  const matchedStr = lineText.match(
    eventType === DEFAULT_EVENT_TYPE_CONSUME ? PRICE_PATTERN : TIME_PATTERN
  );
  if (!matchedStr || matchedStr.length === 0) {
    return 0;
  }
  const numberStr = matchedStr[0].replace(/(花了|用了|花|消费|元)/g, '');
  return unitType === PRICE_TYPE
    ? NumberUtil.convert2Num(numberStr)
    : TimeUtil.convertStr2Time(numberStr);
};

module.exports = {
  getEventType,
  getEventValue,
  getQuestionType,
  getTimeType,
  isQuestion,
  eventTypesInfo,
  PRICE_TYPE,
  TIME_TYPE
};
