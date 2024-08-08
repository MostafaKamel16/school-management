class ClassroomManager {
    constructor({ utils, cache, config, cortex, managers, validators, mongomodels } = {}) {
        this.config = config;
        this.cortex = cortex;
        this.validators = validators;
        this.mongomodels = mongomodels;
        this.tokenManager = managers.token;
        this.classroomsCollection = "classrooms";
        this.httpExposed = ['post=createClassroom', 'get=getClassroom', 'put=updateClassroom', 'delete=deleteClassroom', 'get=listClassrooms'];
        this.utils = utils;
    }

    async createClassroom({ name, school }) {
        const classroom = { name, school };

        // Data validation
        // let result = await this.validators.classroom.createClassroom(classroom);
        // if (result) return result;

        try {

            // Check if the school exists
            const schoolExists = await this.mongomodels.SchoolModel.findById(school);
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
            return { error: 'An error occurred while creating the classroom' };
        }
    }

    async getClassroom({ classroomId }) {
        try {
            let classroom = await this.mongomodels.ClassroomModel.findById(classroomId).populate('school');
            if (!classroom) {
                return { error: 'Classroom not found' };
            }
            return { classroom };
        } catch (error) {
            return { error: 'An error occurred while retrieving the classroom' };
        }
    }

    async updateClassroom({ classroomId, updates }) {
        try {
            let classroom = await this.mongomodels.ClassroomModel.findByIdAndUpdate(classroomId, updates, { new: true });
            if (!classroom) {
                return { error: 'Classroom not found' };
            }
            return { classroom };
        } catch (error) {
            return { error: 'An error occurred while updating the classroom' };
        }
    }

    async deleteClassroom({ classroomId }) {
        try {
            let classroom = await this.mongomodels.ClassroomModel.findByIdAndDelete(classroomId);
            if (!classroom) {
                return { error: 'Classroom not found' };
            }
            return { message: 'Classroom deleted successfully' };
        } catch (error) {
            return { error: 'An error occurred while deleting the classroom' };
        }
    }

    async listClassrooms({ page = 1, limit = 10 }) {
        try {
            let classrooms = await this.mongomodels.ClassroomModel.find()
                .skip((page - 1) * limit)
                .limit(limit)
                .populate('school');
            return { classrooms };
        } catch (error) {
            return { error: 'An error occurred while listing the classrooms' };
        }
    }
}

module.exports = ClassroomManager;