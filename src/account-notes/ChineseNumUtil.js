const CHINESE_NUM_MAPPING = {
  零: '0',
  一: 1,
  二: 2,
  三: 3,
  四: 4,
  五: 5,
  六: 6,
  七: 7,
  八: 8,
  九: 9,
  壹: 1,
  贰: 2,
  叁: 3,
  肆: 4,
  伍: 5,
  陆: 6,
  柒: 7,
  捌: 8,
  玖: 9,
  两: 2
};

const CHINESE_NUM_UNITS = {
  亿: 10000 * 10000,
  万: 10000,
  千: 1000,
  仟: 1000,
  佰: 100,
  百: 100,
  十: 10,
  拾: 10,
  点: 1,
  块: 1,
  元: 1,
  毛: 0.1,
  角: 0.1,
  分: 0.01
};

const NEXT_UNIT_MAP = {
  亿: '千万',
  万: '千',
  千: '百',
  仟: '百',
  百: '十',
  佰: '十',
  块: '角',
  元: '角',
  毛: '分',
  角: '分'
};

const convert2Num = function(str) {
  if (!str) {
    return 0;
  }

  let moneyStr = '';
  for (let i = 0; i < str.length; i++) {
    moneyStr = `${moneyStr}${CHINESE_NUM_MAPPING[str[i]] || str[i]}`;
  }

  const lastChar = moneyStr.charAt(moneyStr.length - 1);
  // last str is not unit, need to supplement next unit.
  if (!CHINESE_NUM_UNITS[lastChar]) {
    for (let i = moneyStr.length - 2; i > 0; i--) {
      // find out the last unit and then supplement its next unit in the end of moneny string.
      if (CHINESE_NUM_UNITS[moneyStr[i]]) {
        moneyStr += NEXT_UNIT_MAP[moneyStr[i]];
        break;
      }
    }
  }

  const value = convert2NumWithOnlyUnits(moneyStr);
  return parseFloat(value.toFixed(2));
};

const convert2NumWithOnlyUnits = function(str) {
  if (!str) {
    return 0;
  }

  for (let i = 0; i < str.length; i++) {
    const unit = CHINESE_NUM_UNITS[str[i]];
    if (unit) {
      let prefixStr = str.substring(0, i);
      let suffixStr = str.substring(i + 1);

      const prefixValue = prefixStr ? convert2NumWithOnlyUnits(prefixStr) : 1;
      const suffixVaue = suffixStr ? convert2NumWithOnlyUnits(suffixStr) : 0;

      return CHINESE_NUM_UNITS[str[i + 1]]
        ? prefixValue * unit * suffixVaue
        : prefixValue * unit + suffixVaue;
    }
  }

  return parseFloat(str);
};

module.exports = {
  convert2Num
};
