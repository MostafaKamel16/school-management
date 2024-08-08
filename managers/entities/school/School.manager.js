class SchoolManager {
    constructor({ utils, cache, config, cortex, managers, validators, mongomodels } = {}) {
        this.config = config;
        this.cortex = cortex;
        this.validators = validators;
        this.mongomodels = mongomodels;
        this.tokenManager = managers.token;
        this.schoolsCollection = "schools";
        this.httpExposed = ['post=createSchool', 'get=getSchool', 'put=updateSchool', 'delete=deleteSchool', 'get=listSchools','post=addAdmins','delete=removeAdmin','put=updateAdmins','get=getAdmins'];
        this.utils = utils;
    }

    async createSchool({ name, address, superadmin }) {
        const school = { name, address, superadmin };

        // Data validation
        // let result = await this.validators.school.createSchool(school);
        // if (result) return result;

        try {
            // Save the school to the database
            let createdSchool = await this.mongomodels.SchoolModel.create(school);

            // Response
            return {
                school: createdSchool
            };
        } catch (error) {
            return { error: 'An error occurred while creating the school' };
        }
    }

    async getSchool({ schoolId }) {
        try {
            let school = await this.mongomodels.SchoolModel.findById(schoolId);
            if (!school) {
                return { error: 'School not found' };
            }
            return { school };
        } catch (error) {
            return { error: 'An error occurred while retrieving the school' };
        }
    }

    async updateSchool({ schoolId, updates }) {
        try {
            let school = await this.mongomodels.SchoolModel.findByIdAndUpdate(schoolId, updates, { new: true });
            if (!school) {
                return { error: 'School not found' };
            }
            return { school };
        } catch (error) {
            return { error: 'An error occurred while updating the school' };
        }
    }

    async deleteSchool({ schoolId }) {
        try {
            let school = await this.mongomodels.SchoolModel.findByIdAndDelete(schoolId);
            if (!school) {
                return { error: 'School not found' };
            }
            return { message: 'School deleted successfully' };
        } catch (error) {
            return { error: 'An error occurred while deleting the school' };
        }
    }

    async listSchools({ page = 1, limit = 10 }) {
        try {
            let schools = await this.mongomodels.SchoolModel.find()
                .skip((page - 1) * limit)
                .limit(limit);
            return { schools };
        } catch (error) {
            return { error: 'An error occurred while listing the schools' };
        }
    }
    async addAdmins({userId,schoolId}){
        try {
            // Check if the user exists
            let user = await this.mongomodels.UserModel.findById(userId);
            if (!user) {
                return { error: 'User not found' };
            }
    
            // Check if the school exists and update the admins array
            let school = await this.mongomodels.SchoolModel.findById(schoolId);
            if (!school) {
                return { error: 'School not found' };
            }
    
            // Add the userId to the admins array if it's not already there
            if (!school.admins.includes(userId)) {
                school.admins.push(userId);
                await school.save();
            }
    
            return { school };
        }
        catch (error) {
            return { error: 'An error occurred while adding the admin' };
        }
    }

    // Remove Admins
    async removeAdmin(schoolId, userId) {
        try {
            const school = await School.findById(schoolId);
            if (!school) {
                return { error: 'School not found' };
            }

            const adminIndex = school.admins.indexOf(userId);
            if (adminIndex > -1) {
                school.admins.splice(adminIndex, 1);
                await school.save();
            }

            return { school };
        } catch (error) {
            return { error: 'An error occurred while removing the admin' };
        }
    }

    // Update Admins
    async updateAdmins(schoolId, newAdmins) {
        try {
            const school = await School.findById(schoolId);
            if (!school) {
                return { error: 'School not found' };
            }

            school.admins = newAdmins;
            await school.save();

            return { school };
        } catch (error) {
            return { error: 'An error occurred while updating the admins' };
        }
    }

    // Get Admins
    async getAdmins(schoolId) {
        try {
            const school = await School.findById(schoolId);
            if (!school) {
                return { error: 'School not found' };
            }

            return { admins: school.admins };
        } catch (error) {
            return { error: 'An error occurred while retrieving the admins' };
        }
    }
}

module.exports = SchoolManager;