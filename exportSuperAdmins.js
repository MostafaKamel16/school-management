const fs = require('fs');
const path = require('path');

// Define the path to the JSON file
const filePath = path.join(__dirname, 'listOfSuperAdmins.json');

// Function to read and export the JSON data
function getSuperAdmins() {
    try {
        const data = fs.readFileSync(filePath, 'utf8');
        const jsonData = JSON.parse(data);
        return jsonData.SuperAdmins;
    } catch (err) {
        console.error('Error reading or parsing the file:', err);
        return null;
    }
}

// Export the function
module.exports = {
    getSuperAdmins
};