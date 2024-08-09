class SchoolManager {
    constructor({ utils, cache, config, cortex, managers, validators, mongomodels } = {}) {
        this.config = config;
        this.cortex = cortex;
        this.validators = validators;
        this.mongomodels = mongomodels;
        this.tokenManager = managers.token;
        this.schoolsCollection = "schools";
        this.httpExposed = ['post=createSchool', 'get=getSchool', 'put=updateSchool', 'delete=deleteSchool', 'get=listSchools','post=addSchoolAdmins'];
        this.utils = utils;
    }


    async verifySuperAdmin(token) {
        const decoded = this.tokenManager.verifyLongToken({ token });
        if (!decoded) {
            return { error: 'Invalid or expired token' };
        }
        let user = await this.mongomodels.UserModel.findById(decoded.userId);
        if (user.role !== 'superAdmin') {
            return { error: 'You are not authorized to perform this operation' };
        }
    }

    async createSchool({ __headers, name, address, superadmin }) {

        // Verify if the user is a super admin
        const verificationResult = await this.verifySuperAdmin(__headers.token);
        if (verificationResult) {
            return verificationResult;
        }

        const school = { name, address, superadmin };

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

    async getSchool({__headers, schoolId }) {
        try {

            // Verify if the user is a super admin
            const verificationResult = await this.verifySuperAdmin(__headers.token);
            if (verificationResult) {
                return verificationResult;
            }
            
            let school = await this.mongomodels.SchoolModel.findById(schoolId);
            if (!school) {
                return { error: 'School not found' };
            }
            return { school };
        } catch (error) {
            return { error: 'An error occurred while retrieving the school' };
        }
    }

    async updateSchool({ __headers,schoolId, updates }) {
        try {
            // Verify if the user is a super admin
            const verificationResult = await this.verifySuperAdmin(__headers.token);
            if (verificationResult) {
                return verificationResult;
            }
            
            let school = await this.mongomodels.SchoolModel.findByIdAndUpdate(schoolId, updates, { new: true });
            if (!school) {
                return { error: 'School not found' };
            }
            return { school };
        } catch (error) {
            return { error: 'An error occurred while updating the school' };
        }
    }

    async deleteSchool({__headers, schoolId }) {
        try {

           // Verify if the user is a super admin
           const verificationResult = await this.verifySuperAdmin(__headers.token);
           if (verificationResult) {
               return verificationResult;
           }

            let school = await this.mongomodels.SchoolModel.findByIdAndDelete(schoolId);
            if (!school) {
                return { error: 'School not found' };
            }
            return { message: 'School deleted successfully' };
        } catch (error) {
            return { error: 'An error occurred while deleting the school' };
        }
    }

    async listSchools({ __headers,page = 1, limit = 10 }) {
        try {

            // Verify if the user is a super admin
                const verificationResult = await this.verifySuperAdmin(__headers.token);
                if (verificationResult) {
                    return verificationResult;
                }

            let schools = await this.mongomodels.SchoolModel.find()
                .skip((page - 1) * limit)
                .limit(limit);
            return { schools };
        } catch (error) {
            return { error: 'An error occurred while listing the schools' };
        }
    }
    async addSchoolAdmins({__headers,userId,schoolId}){
        try {
            // Verify if the user is a super admin
            const verificationResult = await this.verifySuperAdmin(__headers.token);
            if (verificationResult) {
                return verificationResult;
            }
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
                user.role = 'schoolAdmin'
                await user.save(); 
            }
    
            return { school };
        }
        catch (error) {
            console.log(error)
            return { error: 'An error occurred while adding the admin' };
        }
    }

}

module.exports = SchoolManager;