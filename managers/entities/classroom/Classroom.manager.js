class ClassroomManager {
    constructor({ utils, cache, config, cortex, managers, validators, mongomodels } = {}) {
        this.config = config;
        this.cortex = cortex;
        this.validators = validators;
        this.mongomodels = mongomodels;
        this.tokenManager = managers.token;
        this.classroomsCollection = "classrooms";
        this.httpExposed = ['post=createClassroom', 'get=getClassroom', 'put=updateClassroom', 'delete=deleteClassroom'];
        this.utils = utils;
    }

    async verifySchoolAdmin(token,schoolId) {
        const decoded = this.tokenManager.verifyLongToken({ token });
        if (!decoded) {
            return { error: 'Invalid or expired token' };
        }
        const school = await this.mongomodels.SchoolModel.findById(schoolId);
        if (!school.admins.includes(decoded.userId)) {
            return { error: 'You are not authorized to perform this operation' };
        }
    }
    async getSchoolIdFromClassroomId(classroomId) {
        try {
            const classroom = await this.mongomodels.ClassroomModel.findById(classroomId);
            if (!classroom) {
                return { error: 'Classroom not found' };
            }
            return  classroom.school ;
        } catch (error) {
            console.error(error);
            return { error: 'An error occurred while fetching the school ID' };
        }
    }

    async createClassroom({ __headers,name, schoolId }) {

        // Verify if the user is admin of this school
        const verificationResult = await this.verifySchoolAdmin(__headers.token,schoolId);
        if (verificationResult) {
            return verificationResult;
        }
        const school = await this.mongomodels.SchoolModel.findById(schoolId);
        const classroom = { name, school:school };
        

        try {
            // Check if the school exists
            const schoolExists = await this.mongomodels.SchoolModel.findById(schoolId);
             if (!schoolExists) {
            return { error: 'The specified school does not exist' };
        }
            // Save the classroom to the database
            let createdClassroom = await this.mongomodels.ClassroomModel.create(classroom);

            // Response
            return {
                classroom: createdClassroom
            };
        } catch (error) {
            console.log(error)
            return { error: 'An error occurred while creating the classroom' };
        }
    }

    async getClassroom({ __headers,classroomId }) {
        try {
              // Verify if the user is admin of this school
              const schoolId = await this.getSchoolIdFromClassroomId(classroomId);
                const verificationResult = await this.verifySchoolAdmin(__headers.token,schoolId);
                if (verificationResult) {
                    return verificationResult;
            }
            let classroom = await this.mongomodels.ClassroomModel.findById(classroomId).populate('school');
            if (!classroom) {
                return { error: 'Classroom not found' };
            }
            return { classroom };
        } catch (error) {
            console.log(error)
            return { error: 'An error occurred while retrieving the classroom' };
        }
    }

    async updateClassroom({__headers, classroomId, updates }) {
        try {
                 // Verify if the user is admin of this school
              const schoolId = await this.getSchoolIdFromClassroomId(classroomId);
              const verificationResult = await this.verifySchoolAdmin(__headers.token,schoolId);
              if (verificationResult) {
                  return verificationResult;
            }
            let classroom = await this.mongomodels.ClassroomModel.findByIdAndUpdate(classroomId, updates, { new: true });
            if (!classroom) {
                return { error: 'Classroom not found' };
            }
            return { classroom };
        } catch (error) {
            console.log(error)
            return { error: 'An error occurred while updating the classroom' };
        }
    }

    async deleteClassroom({ __headers,classroomId }) {
        try {
             // Verify if the user is admin of this school
             const schoolId = await this.getSchoolIdFromClassroomId(classroomId);
             const verificationResult = await this.verifySchoolAdmin(__headers.token,schoolId);
             if (verificationResult) {
                 return verificationResult;
            }
            let classroom = await this.mongomodels.ClassroomModel.findByIdAndDelete(classroomId);
            if (!classroom) {
                return { error: 'Classroom not found' };
            }
            return { message: 'Classroom deleted successfully' };
        } catch (error) {
            console.log(error)
            return { error: 'An error occurred while deleting the classroom' };
        }
    }
}

module.exports = ClassroomManager;