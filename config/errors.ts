export const errors = {
    user: {
        invalid_user: 'Пользователь недействителен',
        not_found: 'Пользователь не найден',
        wrong_credentials: 'Неверный логин или пароль',
        not_confirmed: 'Пользователь не подтвердил свой аккаунт',
        already_exists: 'Пользователь с таким email уже существует'
    },
    auth: {
        invalid_refresh_token: 'Неверный токен обновления',
        not_authenticated: 'Пользователь не аутентифицирован',
        no_admin_permissions: 'У вас нет прав администратора',
        access_denied: 'Доступ запрещён',
        many_attempts: 'Много попыток. Попробуйте позже'
    },
    confirm: {
        not_sent: 'Не удалось отправить письмо',
        code_expired_or_invalid: 'Код устарел или не существует',
        invalid_code: 'Неверный код'
    },
    general: {
        internal_error: 'Внутренняя ошибка сервера'
    },
    jwt: {
        revoked: 'Токен недействителен. Авторизируйтесь заново'
    },
    sessions: {
        not_found: 'Сессия не найдена'
    }
}
