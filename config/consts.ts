export const config = {
    auth: {
        attempts_limit: 5, // максимальное кол-во неудачных попыток входа
        many_attempts_ban: 300 // время бана в секундах за частые запросы
    }
}
