export type MetricItem = {
  title: string;
  value: number;
  displayValue: string;
  unit: string;
  change: string;
  trend: 'up' | 'down';
};

export type MessageLevel = 'normal' | 'warning' | 'error';

export type RealtimeMessage = {
  id: number;
  time: string;
  level: MessageLevel;
  text: string;
};

export type BusinessNode = {
  name: string;
  status: string;
  visits: number;
  center?: boolean;
};

export const labels = {
  health: '\u7cfb\u7edf\u5065\u5eb7\u5ea6',
  visits: '\u8bbf\u95ee\u91cf',
  orders: '\u8ba2\u5355\u91cf'
};

export const metrics: MetricItem[] = [
  { title: '\u4eca\u65e5\u8bbf\u95ee\u91cf', value: 128936, displayValue: '128,936', unit: '\u6b21', change: '\u2191 12.6%', trend: 'up' },
  { title: '\u5b9e\u65f6\u8ba2\u5355\u91cf', value: 8642, displayValue: '8,642', unit: '\u5355', change: '\u2191 8.2%', trend: 'up' },
  { title: '\u6d3b\u8dc3\u7528\u6237\u91cf', value: 39218, displayValue: '39,218', unit: '\u4eba', change: '\u2193 5.8%', trend: 'down' },
  { title: labels.health, value: 98.7, displayValue: '98.7', unit: '%', change: '\u2191 1.4%', trend: 'up' }
];

export const trendData = {
  times: ['00:00', '03:00', '06:00', '09:00', '12:00', '15:00', '18:00', '21:00'],
  visits: [8000, 6500, 9500, 21000, 28000, 34000, 42000, 37000],
  orders: [600, 550, 800, 1000, 1300, 1700, 2100, 1800]
};

export const developmentData = [
  { name: '\u524d\u7aef\u5f00\u53d1', value: 30 },
  { name: '\u540e\u7aef\u5f00\u53d1', value: 25 },
  { name: '\u6570\u636e\u5206\u6790', value: 20 },
  { name: '\u754c\u9762\u8bbe\u8ba1', value: 15 },
  { name: '\u6d4b\u8bd5\u8fd0\u7ef4', value: 10 }
];

export const businessNodes: BusinessNode[] = [
  { name: '\u5982\u610f\u6570\u636e\u4e2d\u5fc3', status: '\u8fd0\u884c\u6b63\u5e38', visits: 68690, center: true },
  { name: '\u7528\u6237\u4e2d\u5fc3', status: '\u8fd0\u884c\u6b63\u5e38', visits: 17820 },
  { name: '\u8ba2\u5355\u7cfb\u7edf', status: '\u8fd0\u884c\u6b63\u5e38', visits: 12893 },
  { name: '\u652f\u4ed8\u7cfb\u7edf', status: '\u8fd0\u884c\u6b63\u5e38', visits: 10360 },
  { name: '\u5546\u54c1\u4e2d\u5fc3', status: '\u8fd0\u884c\u6b63\u5e38', visits: 15420 },
  { name: '\u6570\u636e\u5206\u6790', status: '\u8fd0\u884c\u6b63\u5e38', visits: 11860 },
  { name: '\u65e5\u5fd7\u670d\u52a1', status: '\u8fd0\u884c\u6b63\u5e38', visits: 8290 },
  { name: '\u76d1\u63a7\u4e2d\u5fc3', status: '\u8fd0\u884c\u6b63\u5e38', visits: 9360 },
  { name: '\u6d88\u606f\u961f\u5217', status: '\u8fd0\u884c\u6b63\u5e38', visits: 10920 }
];

export const cityRanking = [
  { city: '\u5317\u4eac', value: 18000 },
  { city: '\u4e0a\u6d77', value: 16500 },
  { city: '\u6df1\u5733', value: 14800 },
  { city: '\u676d\u5dde', value: 13200 },
  { city: '\u6210\u90fd', value: 11600 },
  { city: '\u6b66\u6c49', value: 9800 }
];

export const abilityRadar = {
  indicators: ['\u6570\u636e\u5904\u7406', '\u754c\u9762\u8bbe\u8ba1', '\u7cfb\u7edf\u6027\u80fd', '\u5de5\u7a0b\u80fd\u529b', '\u9879\u76ee\u7ba1\u7406', '\u89e3\u51b3\u95ee\u9898'],
  values: [92, 85, 88, 90, 78, 86]
};

export const initialMessages: RealtimeMessage[] = [
  { id: 1, time: '21:46:12', level: 'normal', text: '\u7cfb\u7edf\u5b8c\u6210\u4eca\u65e5\u6570\u636e\u540c\u6b65\uff0c\u5171\u5904\u7406128,936\u6761\u6570\u636e' },
  { id: 2, time: '21:45:37', level: 'normal', text: '\u8ba2\u5355\u670d\u52a1\u65b0\u589e16\u7b14\u6709\u6548\u8ba2\u5355' },
  { id: 3, time: '21:39:08', level: 'warning', text: '\u534e\u4e1c\u8282\u70b9\u8bbf\u95ee\u91cf\u5347\u9ad8\uff0c\u5df2\u81ea\u52a8\u6269\u5bb9' },
  { id: 4, time: '21:35:05', level: 'error', text: '\u68c0\u6d4b\u52306\u4e2a\u5f02\u5e38\u8bf7\u6c42\uff0c\u5df2\u5b8c\u6210\u62e6\u622a' },
  { id: 5, time: '21:31:20', level: 'normal', text: '\u6570\u636e\u5e93\u8fd0\u884c\u6b63\u5e38\uff0c\u5e73\u5747\u54cd\u5e94\u65f6\u95f422ms' }
];

export const messageTemplates = [
  { level: 'normal' as const, text: '\u7f13\u5b58\u547d\u4e2d\u7387\u4fdd\u6301\u7a33\u5b9a\uff0c\u6838\u5fc3\u63a5\u53e3\u54cd\u5e94\u6b63\u5e38' },
  { level: 'warning' as const, text: '\u5357\u533a\u8282\u70b9\u6d41\u91cf\u51fa\u73b0\u77ed\u65f6\u6ce2\u52a8\uff0c\u5df2\u89e6\u53d1\u5f39\u6027\u7b56\u7565' },
  { level: 'normal' as const, text: '\u5b9e\u65f6\u753b\u50cf\u4efb\u52a1\u5b8c\u6210\u4e00\u8f6e\u5237\u65b0\uff0c\u7528\u6237\u6807\u7b7e\u5df2\u66f4\u65b0' },
  { level: 'error' as const, text: '\u53d1\u73b0\u5f02\u5e38\u767b\u5f55\u5c1d\u8bd5\uff0c\u5b89\u5168\u7b56\u7565\u5df2\u5b8c\u6210\u963b\u65ad' },
  { level: 'normal' as const, text: '\u8ba2\u5355\u94fe\u8def\u5de1\u68c0\u901a\u8fc7\uff0c\u652f\u4ed8\u56de\u8c03\u5ef6\u8fdf\u4f4e\u4e8e30ms' }
];
