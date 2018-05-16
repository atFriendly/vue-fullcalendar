module.exports = {
	locale: 'zh-tw',
	slotLabelFormat: 'a h(:mm)',
	firstDay: 1, // [0-6] -> [日-六]
	minTime: '06:00:00',
	maxTime: '24:00:00',
	weekends: true, // 顯示周末
	nowIndicator: true, // 顯示目前時間的位置
	columnHeaderFormat: 'ddd M/D',
	views: {
        month: {
			titleFormat: 'YYYY MMMM'
		}
	}
}