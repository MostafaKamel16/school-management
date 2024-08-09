module.exports = {
    createClassroom: [
        {
            model: 'name',
            required: true,
            type: 'string',
            minLength: 3,
            maxLength: 100,
            pattern: '^[a-zA-Z0-9 ]+$' // Alphanumeric characters and spaces only
        },
        {
            model: 'school',
            required: true,
            type: 'string',
            pattern: '^[a-fA-F0-9]{24}$' // MongoDB ObjectId pattern
        }
    ],
}