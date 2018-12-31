const ChineseNumUtil = require('./ChineseNumUtil');

const TIME_UNIT_MAP = {
  天: 24 * 60 * 60,
  小时: 60 * 60,
  分: 60,
  秒: 1
};

const convertStr2Time = function(str) {
  if (!str) {
    return 0;
  }

  str = str.replace(/个|整|钟/g, '');

  for (let unitKey in TIME_UNIT_MAP) {
    if (str.indexOf(unitKey) !== -1) {
      const values = str.split(unitKey);
      let prefixStr = values[0];
      let suffixStr = values[1];

      let extraValue = 0;
      if (lastChar(prefixStr) === '半') {
        extraValue = 0.5;
        prefixStr = prefixStr.substring(0, prefixStr.length - 1);
      }

      return (
        (convertStr2Time(prefixStr) + extraValue) * TIME_UNIT_MAP[unitKey] +
        convertStr2Time(suffixStr)
      );
    }
  }

  return ChineseNumUtil.convert2Num(str);
};

const lastChar = function(str) {
  if (!str) {
    return '';
  }

  return str.substring(str.length - 1);
};

const formatTime2Str = function(milliseconds) {
  const days = Math.floor(milliseconds / (60 * 60 * 24));
  const hours = Math.floor((milliseconds % (60 * 60 * 24)) / 3600);
  const minutes = Math.floor((milliseconds % 3600) / 60);
  const seconds = milliseconds % 60;

  let result = '';
  result += days > 0 ? `${days}天` : '';
  result += hours > 0 ? `${hours}小时` : '';
  result += minutes > 0 ? `${minutes}分钟` : '';
  result += seconds > 0 ? `${seconds}秒` : '';
  return result || 0;
};

module.exports = {
  formatTime2Str,
  convertStr2Time
};
