module.exports = {
    createStudent: [
        {
            model: 'name',
            required: true,
            type: 'string',
            minLength: 3,
            maxLength: 50,
            pattern: '^[a-zA-Z ]+$' // Alphabetic characters and spaces only
        },
        {
            model: 'classroom',
            required: true,
            type: 'string',
            pattern: '^[a-fA-F0-9]{24}$' // MongoDB ObjectId pattern
        },
        {
            model: 'age',
            required: false,
            type: 'number',
            minimum: 1,
            maximum: 120
        }
    ],
}