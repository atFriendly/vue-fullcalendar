module.exports = {
	displayEventTime: false,
	slotLabelFormat: 'HH', //'a h(:mm)'
	slotEventOverlap: false, // 行程重疊顯示
	firstDay: 1, // [0-6] -> [日-六]
	minTime: '06:00:00',
	maxTime: '24:00:00',
	weekends: true, // 顯示周末
	nowIndicator: true, // 顯示目前時間的位置
	lazyFetching: false,
	allDaySlot: false,
	columnHeaderFormat: 'ddd M/D',
	fixedWeekCount: false,
	showNonCurrentDates: false,
	views: {
        month: {
			titleFormat: '\ ' // 'YYYY MMMM'
        },
        week: {
            titleFormat: '\ ' // 'YYYY MMMDo'
        },
        day: {
            titleFormat: 'YYYY MMMD'
        }
	}
}
