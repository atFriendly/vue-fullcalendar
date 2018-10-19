let $, cal
let vm

exports.initVar = (jquery, calElement, instance) => {
    $ = jquery
    cal = calElement
    vm = instance
}

/**
 * 組成右上角的按鈕群
 * * button格式: { text, id, badge, class, visible, enable }
 * * event: 統一呼叫 customButtonClick (button { id: BUTTON_ID })
 */
exports.setTopRightButtons = (buttons = []) => {
    $(cal).find('div.fc-right').empty()
    buttons.map(val => {
        const elementPanel = document.createElement('span')
        $(elementPanel).css('position', 'relative')
        $(elementPanel).attr('name', val.id + 'Panel')

        const button = document.createElement('button')
        let buttonText = val.text + (val.badge ? ('(' + val.badge + ')') : '')
        let classNames = val.class ? val.class : 'el-button el-button--danger el-button-mini'
        // console.log('val:', val)
        if (val.isMobile && val.isMobile === true) {
            // classNames = 'el-button el-button--danger el-button-mini is-circle' // circle效果不好
            buttonText = val.badge || ''
            if (val.iconClass) {
                const span = document.createElement('span')
                const icon = document.createElement('i')
                $(icon).addClass(val.iconClass)
                $(icon).attr('style', 'padding-right: 2px')
                const text = document.createElement('span')
                $(text).text(buttonText)
                span.appendChild(icon)
                span.appendChild(text)
                button.appendChild(span)
            } else {
                $(button).text(buttonText)
            }
            $(button).attr('data-orig-text', val.text)
            $(button).addClass(classNames)
        } else {
            $(button).attr('data-orig-text', val.text)
            $(button).text(buttonText)
            $(button).addClass(classNames)
        }

        if (val.hasOwnProperty('enable')) {
            if (val.enable === false) {
                $(button).attr('disabled', 'disabled')
                $(button).addClass('is-disabled')
            }
        }
        if (val.hasOwnProperty('visible')) {
            $(button).css('display', val.visible === true ? 'inline-block' : 'none')
        }
        $(button).attr('id', val.id)
        $(button).on('click', () => {
            vm.$emit('custom-button-click', { id: val.id })
        })
        elementPanel.appendChild(button)

        $(cal).find('div.fc-right')[0].appendChild(elementPanel)
    })
}

/**
 * 組成左上角的按鈕群
 * * button格式: { text, id, badge, class, visible, enable }
 * * event: 統一呼叫 customButtonClick (button { id: BUTTON_ID })
 */
exports.setTopLeftButtons = (buttons = []) => {
    $(cal).find('div.fc-left').empty()
    let group = null
    buttons.map(val => {
        const button = document.createElement('button')
        let classNames = val.class ? val.class : 'el-button el-button--danger el-button-mini'
        // console.log('val:', val)
        if (val.iconClass) {
            const span = document.createElement('span')
            const icon = document.createElement('i')
            $(icon).addClass(val.iconClass)
            span.appendChild(icon)
            if (val.text) {
                $(icon).attr('style', 'padding-right: 2px')
                const text = document.createElement('span')
                $(text).text(val.text)
                span.appendChild(text)
            }
            button.appendChild(span)
        } else {
            $(button).text(val.text || '')
        }
        $(button).attr('data-orig-text', val.text || '')
        $(button).addClass(classNames)

        if (val.hasOwnProperty('enable')) {
            if (val.enable === false) {
                $(button).attr('disabled', 'disabled')
                $(button).addClass('is-disabled')
            }
        }
        if (val.hasOwnProperty('visible')) {
            $(button).css('display', val.visible === true ? 'inline-block' : 'none')
        }
        $(button).attr('id', val.id)
        $(button).on('click', (event) => {
            vm.$emit('custom-button-click', { event, id: val.id })
        })

        if (val.groupName) {
            if (group) {
                if ($(group).attr('name') !== (val.groupName + '_Group')) {
                    $(cal).find('div.fc-left')[0].appendChild(group)
                    group = null
                }
            }
            if (!group) {
                group = document.createElement('span')
                $(group).addClass('el-button-group')
                $(group).css('position', 'relative')
                $(group).attr('name', val.groupName + '_Group')
            }
            group.appendChild(button)
        } else {
            if (group) {
                $(cal).find('div.fc-left')[0].appendChild(group)
                group = null
            } else {
                $(cal).find('div.fc-left')[0].appendChild(button)
            }
        }
    })
    if (group) {
        $(cal).find('div.fc-left')[0].appendChild(group)
        group = null
    }
}

/**
 * 更新自訂按鈕的文字、通知氣泡等…
 */
exports.updateButton = (id, val = {}) => {
    const button = $(cal).find('button[id="' + id + '"]')
    if (button.length > 0) {
        if (val.text) {
            $(button).attr('data-orig-text', val.text)
            $(button).text(val.text)
        }
        if (val.badge) {
            // const displayBadge = val.badge && val.badge.toString().length > 0;
            // $(button[0].nextSibling).text(val.badge)
            // $(button[0].nextSibling).css(displayBadge ? 'inline-block' : 'none')
            const badge = val.badge.toString().length > 0 ? ('(' + val.badge + ')') : '';
            const buttonText = $(button).attr('data-orig-text') + badge
            $(button).text(buttonText)
        }
        if (val.hasOwnProperty('enable')) {
            if (val.enable === true) {
                $(button).removeAttr('disabled')
                $(button).removeClass('is-disabled')
            } else {
                $(button).attr('disabled', 'disabled')
                $(button).addClass('is-disabled')
            }
        }
        if (val.hasOwnProperty('visible')) {
            $(button).css('display', val.visible === true ? 'inline-block' : 'none')
        }
    }
}

exports.setTitle = (text, subtitle) => {
    const title = document.createElement('div')
    $(title).html('<h3 style="margin: 0px; margin-top: 5px;">' + text + '</h3>')
    $('div.fc-center')[0].appendChild(title)
    if (subtitle) {
        const sub = document.createElement('div')
        $(sub).text(subtitle)
        $(sub).css({
            'color': '#2C3E50',
            'font-size': '1rem'
        })
        $(title)[0].appendChild(sub)
    }
	$('div.fc-center').attr('title', text)
	// 點擊標題事件
    $('div.fc-center').on('click', () => {
        vm.$emit('title-click')
    })
}

exports.createUndecidedZone = () => {
    if (!vm.config.showUndecideZone) {
        return
    }
    const zone = document.createElement('span')
    $(zone).attr('id', 'undecided-zone')
    $(zone).css({
        'height': '150px',
        'width': '200px',
        'position': 'absolute',
        'top': '130px',
        'right': '5px',
        'z-index': 10,
        'background-color': '#D9534F22',
        'text-align': 'center'
    })
    const text = document.createElement('span')
    $(text).css({
        'font-size': '20px',
        'color': '#D9534F',
        'display': 'block',
        'margin-top': '50px'
    })
    $(text).text('未定拖曳至此')
    zone.appendChild(text)
    $('#calendar')[0].appendChild(zone)
}

exports.destoryUndecidedZone = () => {
    $('#undecided-zone').remove()
}

exports.checkDropInUndecidedZone = (x = 0, y = 0) => {
	if (!vm.config.showUndecideZone) {
        return false
    }
    const zone = $('#undecided-zone')
    let inZone = false
    if (zone) {
		try {
			let offset = zone.offset()
			offset.right = zone.width() + offset.left
			offset.bottom = zone.height() + offset.top

			if (x >= offset.left && y >= offset.top
				&& x <= offset.right && y <= offset.bottom) {
				inZone = true
			}
		} catch (error) {
			inZone = false
		}
    }
    this.destoryUndecidedZone()
    return inZone
}
