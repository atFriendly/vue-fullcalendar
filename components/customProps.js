module.exports = {
	allDaySlot: false,
	columnHeaderFormat: 'ddd M/D',
	displayEventTime: false,
	firstDay: 1, // [0-6] -> [日-六]
    eventBackgroundColor: '#668CD9',
    eventBorderColor: '#2952A3',
    eventTextColor: '#FFF',
	fixedWeekCount: false,
	lazyFetching: false,
	minTime: '06:00:00',
	maxTime: '24:00:00',
	nowIndicator: true, // 顯示目前時間的位置
    selectConstraint: { // 禁止新增跨天行程
        start: '00:00',
        end: '24:00'
    },
	showNonCurrentDates: false,
	slotLabelFormat: 'HH', //'a h(:mm)'
	slotEventOverlap: false, // 行程重疊顯示
	views: {
        month: {
            titleFormat: '\ ', // 'YYYY MMMM'
            columnHeaderFormat: 'dddd'
        },
        week: {
            titleFormat: '\ ' // 'YYYY MMMDo'
        },
        day: {
            titleFormat: '\ '
        }
    },
	weekends: true, // 顯示周末
	showUndecideZone: false // 拖拉行程時顯示未定行程區塊
}
