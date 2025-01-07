async function loginAndConnectSocket() {
    const res = await fetch('http://localhost:8000/api/auth', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email: 'onishruslan@yandex.ru',
            password: 'test123321'
        })
    })

    const data = await res.json()
    const access_token = data.access_token

    // 2. Подключаем WebSocket с переданным токеном
    const socket = io('http://localhost:8000/api/socket/chat', {
        extraHeaders: {
            Authorization: `Bearer ${access_token}`
        }
    })

    socket.on('message', (data) => {
        console.log('Получено сообщение:', data)
    })

    socket.emit('message', { message: 'Привет, сервер!' })
}

loginAndConnectSocket()
