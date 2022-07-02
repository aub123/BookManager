const notification = (title, msg, page, setPage, alt, fallback) => {
    if (Notification.permission === 'granted') {
        var notification = new Notification(title, {
            body: msg
        })
        notification.onclick = () => {
            if (page !== undefined) {
                setPage(page)
            }
        }
    }
    else if (Notification.permission !== 'denied') {
        Notification.requestPermission().then((permission) => {
            if (permission === 'granted') {
                var notification = new Notification(title, {
                    body: msg
                })
                notification.onclick = () => {
                    if (page !== undefined) {
                        setPage(page)
                    }
                }
            } else {
                if (alt) {
                    fallback(title + ' ' + msg)
                }
            }
        })
    }
    else if (alt) {
        fallback(title + ' ' + msg)
    }
}

export default notification