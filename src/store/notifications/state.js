export default function () {
  return {
    subscription: null,
    notificationList: [
      {
        id: 0,
        type: 'medication',
        title: '請記得在 10:00 點服用 a 藥物',
        isRead: false,
        timestamp: 1562308818241
      },
      {
        id: 1,
        type: 'medication',
        title: '請記得在 18 點服用 b 藥物',
        isRead: false,
        timestamp: 1562308818241
      },
      {
        id: 2,
        type: 'medication',
        title: '請記得在 21 點服用 c 藥物',
        isRead: false,
        timestamp: 1562308818241
      },
      {
        id: 3,
        type: 'medication',
        title: '請記得在 6 點服用 前一天 藥物',
        isRead: false,
        timestamp: 1562198400000
      },
      {
        id: 4,
        type: 'medication',
        title: '請記得在 6 點服用 很多天前 藥物',
        isRead: false,
        timestamp: 1561939200000
      }
    ]
  }
}
