let $, cal
let that

exports.initVar = (jquery, calElement, instance) => {
    $ = jquery
    cal = calElement
    that = instance
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
        $(elementPanel).attr('name', val.buttonName + 'Panel')

        const button = document.createElement('button')
        const buttonText = val.text + (val.badge ? ('(' + val.badge + ')') : '')
        $(button).attr('data-orig-text', val.text)
        $(button).text(buttonText)
        $(button).addClass(val.class ? val.class : 'el-button el-button--danger el-button-mini')

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
            that.$emit('custom-button-click', { id: val.id })
        })
        elementPanel.appendChild(button)

        $(cal).find('div.fc-right')[0].appendChild(elementPanel)
    })
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

exports.setTitle = (text) => {
	$('div.fc-center').html('<h3 style="margin: 0px; margin-top: 5px;">' + text + '</h3>')
	$('div.fc-center').attr('title', text)
	// 點擊標題事件
    $('div.fc-center').on('click', () => {
        that.$emit('title-click')
    })
}

exports.createUndecidedZone = () => {
    if (!that.config.showUndecideZone) {
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
    $(text).text('拖曳至未定')
    zone.appendChild(text)
    $('#calendar')[0].appendChild(zone)
}

exports.destoryUndecidedZone = () => {
    $('#undecided-zone').remove()
}

exports.checkDropInUndecidedZone = (x = 0, y = 0) => {
    const zone = $('#undecided-zone')
    let inZone = false
    if (zone) {
        let offset = zone.offset()
        offset.right = zone.width() + offset.left
        offset.bottom = zone.height() + offset.top

        if (x >= offset.left && y >= offset.top
            && x <= offset.right && y <= offset.bottom) {
            inZone = true
        }
    }
    this.destoryUndecidedZone()
    return inZone
}
