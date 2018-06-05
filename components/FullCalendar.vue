<template>
    <div ref="calendar" id="calendar"></div>
</template>

<script>
    import defaultsDeep from 'lodash.defaultsdeep'
    import 'fullcalendar'
	import $ from 'jquery'
	//以不破壞原專案架構為原則，使用載入的方式作預設設定
	import defaultProps from './defaultProps.js'
	import './fullcalendar.css'

    export default {
        props: {
            events: {
                default() {
                    return []
                },
            },

            eventSources: {
                default() {
                    return []
                },
            },

            editable: {
                default() {
                    return true
                },
            },

            selectable: {
                default() {
                    return true
                },
            },

            selectHelper: {
                default() {
                    return true
                },
            },

            header: {
                default() {
                    return {
                        left:   'prev,next today',
                        center: 'title',
                        right:  'month,agendaWeek,agendaDay'
                    }
                },
            },

            defaultView: {
                default() {
                    return 'agendaWeek'
                },
            },

            sync: {
                default() {
                    return false
                }
            },

            config: {
                type: Object,
                default() {
                    return {}
                },
            },
        },

        computed: {
            defaultConfig() {
                const self = this
                return {
                    header: this.header,
                    defaultView: this.defaultView,
                    editable: this.editable,
                    selectable: this.selectable,
                    selectHelper: this.selectHelper,
                    aspectRatio: 2,
                    timeFormat: 'HH:mm',
                    events: this.events,
					eventSources: this.eventSources,

                    eventRender(...args) {
                        if (this.sync) {
                            self.events = cal.fullCalendar('clientEvents')
                        }
                        self.$emit('event-render', ...args)
                    },

                    eventDestroy(event) {
                        if (this.sync) {
                            self.events = cal.fullCalendar('clientEvents')
                        }
                    },

                    eventClick(...args) {
                        self.$emit('event-selected', ...args)
                    },

                    eventDrop(...args) {
                        self.$emit('event-drop', ...args)
                    },

                    eventReceive(...args) {
                        self.$emit('event-receive', ...args)
                    },

                    eventResize(...args) {
                        self.$emit('event-resize', ...args)
                    },

                    dayClick(...args){
                        self.$emit('day-click', ...args)
					},

                    select(start, end, jsEvent, view, resource) {
                        self.$emit('event-created', {
                            start,
                            end,
                            allDay: !start.hasTime() && !end.hasTime(),
                            view,
                            resource
                        })
					},

					...defaultProps,
					eventMouseover: (event, jsEvent, view) => {
						// 滑鼠移到行程上的效果
						this.$(jsEvent.currentTarget).css('box-shadow', '1px 1px 8px 1px #666')
						jsEvent.currentTarget.title = event.title
						self.$emit('event-mouseover', event, jsEvent, view)
					},
					eventMouseout: (event, jsEvent, view) => {
						this.$(jsEvent.currentTarget).css('box-shadow', '')
						self.$emit('event-mouseout', event, jsEvent, view)
					},
					viewRender: (view, element) => {
						// 六日紅背景
						this.$(element).find('td.fc-day.fc-sat').css('background-color', '#FFDDDD99')
                        this.$(element).find('td.fc-day.fc-sun').css('background-color', '#FFDDDD99')
                        // 標題style
                        this.$('div#calendar').find('div.fc-center').css({
                            'cursor': 'pointer',
                            'user-select': 'none',
                        })
						self.$emit('view-render', view, element)
                    },
                }
            },
        },

        mounted() {
            const cal = $(this.$el)
			self = this
			//點擊標題事件
            this.$(cal).ready(() => {
                this.$(cal).find('div.fc-center').on('click', () => {
                    self.$emit('title-click')
                })
            })

            this.$on('remove-event', (event) => {
                if(event && event.hasOwnProperty('id')){
                    $(this.$el).fullCalendar('removeEvents', event.id);
                }else{
                    $(this.$el).fullCalendar('removeEvents', event);
                }
            })

            this.$on('rerender-events', () => {
                $(this.$el).fullCalendar('rerenderEvents')
            })

            this.$on('refetch-events', () => {
                $(this.$el).fullCalendar('refetchEvents')
            })

            this.$on('render-event', (event) => {
                $(this.$el).fullCalendar('renderEvent', event)
            })

            this.$on('reload-events', () => {
                $(this.$el).fullCalendar('removeEvents')
                $(this.$el).fullCalendar('addEventSource', this.events)
            })

            this.$on('rebuild-sources', () => {
                $(this.$el).fullCalendar('removeEventSources')
                this.eventSources.map(event => {
                    $(this.$el).fullCalendar('addEventSource', event)
                })
            })

            cal.fullCalendar(defaultsDeep(this.config, this.defaultConfig))
        },

        methods: {
            fireMethod(...options) {
                return $(this.$el).fullCalendar(...options)
            },
            /**
             * 組成右上角的按鈕群
             * * button格式: { text, buttonName, badge, class, visible, enable }
             * * event: 統一呼叫 customButtonClick (button = { name: 'buttonName' })
             */
            setTopRightButtons(buttons = []) {
                $(this.$el).find('div.fc-right').empty()
                self = this
                buttons.map(val => {
                    const elementPanel = document.createElement('span')
                    this.$(elementPanel).css('position', 'relative')
                    this.$(elementPanel).attr('name', val.buttonName + 'Panel')

                    const button = document.createElement('button')
                    this.$(button).addClass(val.class ? val.class : 'el-button el-button--danger el-button-mini')
                    this.$(button).text(val.text)
                    if (val.hasOwnProperty('enable')) {
                        if (val.enable === false) {
                            this.$(button).attr('disabled', 'disabled')
                            this.$(button).addClass('is-disabled')
                        }
                    }
                    if (val.hasOwnProperty('visible')) {
                        this.$(button).css('display', val.visible === true ? 'inline-block' : 'none')
                    }
                    this.$(button).attr('name', val.buttonName)
                    this.$(button).on('click', () => {
                        self.$emit('custom-button-click', { name: val.buttonName })
                    })
                    elementPanel.appendChild(button)

                    const badge = document.createElement('sup')
                    const displayBadge = val.badge && val.badge.toString().length > 0;
                    this.$(badge).addClass('el-badge__content is-fixed')
                    this.$(badge).text(val.badge)
                    this.$(badge).css({
                        'display': displayBadge ? 'inline-block' : 'none',
                        'z-index': 10,
                        'right': '15px'
                    })
                    elementPanel.appendChild(badge)

                    $(this.$el).find('div.fc-right')[0].appendChild(elementPanel)
                })
            },
            /**
             * 更新自訂按鈕的文字、通知氣泡等…
             */
            updateButton(name, val = {}) {
                const button = $(this.$el).find('button[name="' + name + '"]')
                if (button.length > 0) {
                    if (val.text) {
                        $(button).text(val.text)
                    }
                    if (val.badge) {
                        const displayBadge = val.badge && val.badge.toString().length > 0;
                        $(button[0].nextSibling).text(val.badge)
                        $(button[0].nextSibling).css(displayBadge ? 'inline-block' : 'none')
                    }
                    if (val.hasOwnProperty('enable')) {
                        if (val.enable === true) {
                            this.$(button).removeAttr('disabled')
                            this.$(button).removeClass('is-disabled')
                        } else {
                            this.$(button).attr('disabled', 'disabled')
                            this.$(button).addClass('is-disabled')
                        }
                    }
                    if (val.hasOwnProperty('visible')) {
                        this.$(button).css('display', val.visible === true ? 'inline-block' : 'none')
                    }
                }
            }
        },

        watch: {
            events: {
                deep: true,
                handler(val) {
                    $(this.$el).fullCalendar('removeEvents')
                    $(this.$el).fullCalendar('addEventSource', this.events)
                },
            },
            eventSources: {
                deep: true,
                handler(val) {
                    this.$emit('rebuild-sources')
                },
            },
        },

        beforeDestroy() {
            this.$off('remove-event')
            this.$off('rerender-events')
            this.$off('refetch-events')
            this.$off('render-event')
            this.$off('reload-events')
            this.$off('rebuild-sources')
        },
    }
</script>
