<template>
    <div ref="calendar" id="calendar"></div>
</template>

<script>
    import defaultsDeep from 'lodash.defaultsdeep'
    import 'fullcalendar'
	import $ from 'jquery'
	//以不破壞原專案架構為原則，使用載入的方式作預設設定
    import customProps from './customProps.js'
    import customMethod from './customMethod.js'
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
                        center: '',
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
                const vm = this
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
                    ...customProps,

                    eventRender(...args) {
                        if (this.sync) {
                            vm.events = cal.fullCalendar('clientEvents')
                        }
                        vm.$emit('event-render', ...args)
                    },

                    eventDestroy(event) {
                        if (this.sync) {
                            vm.events = cal.fullCalendar('clientEvents')
                        }
                    },

                    eventClick(...args) {
                        vm.$emit('event-selected', ...args)
                    },

                    eventDrop(...args) {
                        vm.$emit('event-drop', ...args)
                    },

                    eventReceive(...args) {
                        vm.$emit('event-receive', ...args)
                    },

                    eventResize(...args) {
                        vm.$emit('event-resize', ...args)
                    },

                    dayClick(...args){
                        vm.$emit('day-click', ...args)
					},

                    select(start, end, jsEvent, view, resource) {
                        vm.$emit('event-created', {
                            start,
                            end,
                            allDay: !start.hasTime() && !end.hasTime(),
                            view,
                            resource
                        })
					},
					eventMouseover: (event, jsEvent, view) => {
						// 滑鼠移到行程上的效果
						this.$(jsEvent.currentTarget).css('box-shadow', '1px 1px 8px 1px #666')
						jsEvent.currentTarget.title = event.title
						vm.$emit('event-mouseover', event, jsEvent, view)
					},
					eventMouseout: (event, jsEvent, view) => {
						this.$(jsEvent.currentTarget).css('box-shadow', '')
						vm.$emit('event-mouseout', event, jsEvent, view)
					},
					eventDragStart: (event, jsEvent, ui, view) => {
                        this.createUndecidedZone()
                        vm.$emit('event-dragstart', event, jsEvent, ui, view)
                    },
                    eventDragStop: (event, jsEvent, ui, view) => {
						this.checkDropInUndecidedZone(jsEvent.clientX, jsEvent.clientY)
                        vm.$emit('event-dragstop', event, jsEvent, ui, view)
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
						vm.$emit('view-render', view, element)
                    },
                }
            },
        },

        mounted() {
            const cal = $(this.$el)
            this.vm = this
            customMethod.initVar($, cal, this)

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
            ...customMethod
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
