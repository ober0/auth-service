export const config = {
    auth: {
        attempts_limit: 5, // максимальное кол-во неудачных попыток входа
        many_attempts_ban: 300 // время бана в секундах за частые запросы
    },
    jwt: {
        access_tokenExpiresIn: 15 * 60, //время эизни access token в секундах
        refresh_tokenExpiresIn: 7 * 24 * 60 * 60 //время жизни refresh token в секундах
    }
}
