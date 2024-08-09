module.exports = {
    createSchool: [
        {
            model: 'name',
            required: true,
            type: 'string',
            minLength: 3,
            maxLength: 100,
            pattern: '^[a-zA-Z0-9 ]+$' // Alphanumeric characters and spaces only
        },
        {
            model: 'address',
            required: true,
            type: 'string',
            minLength: 10,
            maxLength: 200
        },
        {
            model: 'admins',
            required: true,
            type: 'string',
            pattern: '^[a-fA-F0-9]{24}$' // MongoDB ObjectId pattern
        }
    ],
}