async function loginAndConnectSocket() {
    const res = await fetch('http://localhost:8000/api/auth', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email: prompt('Enter email'),
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

    socket.on('answer', (data) => {
        console.log('Ответ:', data)
    })

    socket.on('message', (data) => {
        console.log(data)
    })

    socket.emit('message', { message: 'Привет', id: 24 })
}

loginAndConnectSocket()
