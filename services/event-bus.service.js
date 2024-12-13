function createEventEmitter() {
    const listenersMap = {}
    // For debug:
    // window.mapmap = listenersMap
    return {
        // Use this function to subscribe to an event
        on(evName, listener) {
            listenersMap[evName] = (listenersMap[evName]) ? [...listenersMap[evName], listener] : [listener]
            return () => {
                listenersMap[evName] = listenersMap[evName].filter(func => func !== listener)
            }
        },
        // Use this function to emit an event
        emit(evName, data) {
            if (!listenersMap[evName]) return
            listenersMap[evName].forEach(listener => listener(data))
        }
    }
}

export const eventBusService = createEventEmitter()

export function showUserMsg(msg) {
    eventBusService.emit('show-user-msg', msg)
}

export function showSuccessMsg(txt) {
    showUserMsg({ txt, type: 'success' })
}

export function showErrorMsg(txt) {
    showUserMsg({ txt, type: 'error' })
}

// Example for using the service
// eventBusService.on('some-event', (data) => {
//     console.log('Got some-event:', data)
// })
// eventBusService.emit('some-event', { num: 100, blabla:'Bla!' })
// const unsubscribe = eventBusService.on('some-event', (data) => {
//     console.log('Me Too!', data)
// })

// eventBusService.emit('some-event', { num: 100 })

// Just as example - unsubscribe after 2 secs
// setTimeout(() => {
//     unsubscribe()
// }, 2000)
// setTimeout(() => eventBusService.emit('some-event', { num: 999 }), 3000)












