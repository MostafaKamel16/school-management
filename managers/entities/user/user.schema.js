

module.exports = {
    createUser: [
        {
            model: 'username',
            required: true,
            type: 'string',
            minLength: 3,
            maxLength: 30,
            pattern: '^[a-zA-Z0-9]+$' // Alphanumeric only
        },
        {
            model: 'email',
            required: true,
            type: 'string',
            format: 'email' // Ensures the email format is valid
        },
        {
            model: 'password',
            required: true,
            type: 'string',
            minLength: 8, // Minimum length of 8 characters
            maxLength: 100,
            pattern: '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$' // At least one uppercase letter, one lowercase letter, one number, and one special character
        }
    ],
}


