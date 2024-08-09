class StudentManager {
    constructor({ utils, cache, config, cortex, managers, validators, mongomodels } = {}) {
        this.config = config;
        this.cortex = cortex;
        this.validators = validators;
        this.mongomodels = mongomodels;
        this.tokenManager = managers.token;
        this.studentsCollection = "students";
        this.httpExposed = ['post=createStudent', 'get=getStudent', 'put=updateStudent', 'delete=deleteStudent'];
        this.utils = utils;
    }
    async verifySchoolAdmin(token,classroomId) {
        const decoded = this.tokenManager.verifyLongToken({ token });
        if (!decoded) {
            return { error: 'Invalid or expired token' };
        }
        const classroom = await this.mongomodels.ClassroomModel.findById(classroomId);
        const school = await this.mongomodels.SchoolModel.findById(classroom.school);
        if (!school.admins.includes(decoded.userId)) {
            return { error: 'You are not authorized to perform this operation' };
        }
    }

    async getClassroomIdFromStudentId(studentId) {
        try {
            const student = await this.mongomodels.StudentModel.findById(studentId);
            if (!student) {
                return { error: 'Student not found' };
            }
            return  student.classroom ;
        } catch (error) {
            console.error(error);
            return { error: 'An error occurred while fetching the school ID' };
        }
    }
    

    async createStudent({ __headers,name, classroom, age }) {
          // Verify if the user is admin of this school
          const verificationResult = await this.verifySchoolAdmin(__headers.token,classroom);
          if (verificationResult) {
              return verificationResult;
          }
        const student = { name, classroom, age };

   
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

    async getStudent({ __headers,studentId }) {
        try {
            const classroom = await this.getClassroomIdFromStudentId(studentId);
            const verificationResult = await this.verifySchoolAdmin(__headers.token,classroom);
            if (verificationResult) {
                return verificationResult;
        }
            let student = await this.mongomodels.StudentModel.findById(studentId).populate('classroom');
            if (!student) {
                return { error: 'Student not found' };
            }
            return { student };
        } catch (error) {
            return { error: 'An error occurred while retrieving the student' };
        }
    }

    async updateStudent({__headers, studentId, updates }) {
        try {
            const classroom = await this.getClassroomIdFromStudentId(studentId);
            const verificationResult = await this.verifySchoolAdmin(__headers.token,classroom);
            if (verificationResult) {
                return verificationResult;
        }
            let student = await this.mongomodels.StudentModel.findByIdAndUpdate(studentId, updates, { new: true });
            if (!student) {
                return { error: 'Student not found' };
            }
            return { student };
        } catch (error) {
            return { error: 'An error occurred while updating the student' };
        }
    }

    async deleteStudent({ __headers,studentId }) {
        try {
            const classroom = await this.getClassroomIdFromStudentId(studentId);
            const verificationResult = await this.verifySchoolAdmin(__headers.token,classroom);
            if (verificationResult) {
                return verificationResult;
        }
            let student = await this.mongomodels.StudentModel.findByIdAndDelete(studentId);
            if (!student) {
                return { error: 'Student not found' };
            }
            return { message: 'Student deleted successfully' };
        } catch (error) {
            return { error: 'An error occurred while deleting the student' };
        }
    }
}

module.exports = StudentManager;