class StudentManager {
    constructor({ utils, cache, config, cortex, managers, validators, mongomodels } = {}) {
        this.config = config;
        this.cortex = cortex;
        this.validators = validators;
        this.mongomodels = mongomodels;
        this.tokenManager = managers.token;
        this.studentsCollection = "students";
        this.httpExposed = ['post=createStudent', 'get=getStudent', 'put=updateStudent', 'delete=deleteStudent', 'get=listStudents'];
        this.utils = utils;
    }

    async createStudent({ name, classroom, age }) {
        const student = { name, classroom, age };

        // Data validation
        // let result = await this.validators.student.createStudent(student);
        // if (result) return result;

        try {
            // Check if the classroom exists
            const classroomExists = await this.mongomodels.ClassroomModel.findById(classroom);
            if (!classroomExists) {
                return { error: 'The specified classroom does not exist' };
            }
            // Save the student to the database
            let createdStudent = await this.mongomodels.StudentModel.create(student);

            // Response
            return {
                student: createdStudent
            };
        } catch (error) {
            return { error: 'An error occurred while creating the student' };
        }
    }

    async getStudent({ studentId }) {
        try {
            let student = await this.mongomodels.StudentModel.findById(studentId).populate('classroom');
            if (!student) {
                return { error: 'Student not found' };
            }
            return { student };
        } catch (error) {
            return { error: 'An error occurred while retrieving the student' };
        }
    }

    async updateStudent({ studentId, updates }) {
        try {
            let student = await this.mongomodels.StudentModel.findByIdAndUpdate(studentId, updates, { new: true });
            if (!student) {
                return { error: 'Student not found' };
            }
            return { student };
        } catch (error) {
            return { error: 'An error occurred while updating the student' };
        }
    }

    async deleteStudent({ studentId }) {
        try {
            let student = await this.mongomodels.StudentModel.findByIdAndDelete(studentId);
            if (!student) {
                return { error: 'Student not found' };
            }
            return { message: 'Student deleted successfully' };
        } catch (error) {
            return { error: 'An error occurred while deleting the student' };
        }
    }

    async listStudents({ page = 1, limit = 10 }) {
        try {
            let students = await this.mongomodels.StudentModel.find()
                .skip((page - 1) * limit)
                .limit(limit)
                .populate('classroom');
            return { students };
        } catch (error) {
            return { error: 'An error occurred while listing the students' };
        }
    }
    async addAdmins({userId,schoolId}){
        try {
            let user = await this.mongomodels.UserModel.findById(userId);
            if (!user) {
                return { error: 'User not found' };
            }
            let school = await this.mongomodels.SchoolModel.findByIdAndUpdate(schoolId,updates, { new: true });
            if (!school) {
                return { error: 'School not found' };
            }
          
        }
        catch (error) {
            return { error: 'An error occurred while adding the admin' };
        }
    }
}

module.exports = StudentManager;