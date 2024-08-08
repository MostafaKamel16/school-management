module.exports = class User { 

    constructor({utils, cache, config, cortex, managers, validators, mongomodels }={}){
        this.config              = config;
        this.cortex              = cortex;
        this.validators          = validators; 
        this.mongomodels         = mongomodels;
        this.tokenManager        = managers.token;
        this.usersCollection     = "users";
        this.httpExposed         = ['post=createUser', 'get=getUser', 'put=updateUser','delete=deleteUser', 'get=listUsers'];
        this.utils= utils;
    }

    async createUser({username, email, password}){  
        const user = {username, email, password};

        // Data validation
        let result = await this.validators.user.createUser(user);
        if(result) return result;
        
        try {
        // Check if user already exists
        let existingUser = await this.mongomodels.UserModel.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            return { error: 'User with this email or username already exists' };
        }
         // Hash the password before saving
        user.password = await this.utils.hashPassword(password);
            // Save the user to the database
        let createdUser = await this.mongomodels.UserModel.create(user);
        // Creation Logic
        let longToken       = this.tokenManager.genLongToken({userId: createdUser._id, userKey: createdUser.key });
        
        // Response
        return {
            user: createdUser, 
            longToken 
        };
    }
    catch (error) {
        return { error: 'An error occurred while creating the user' };
    }
    }
    async getUser({ userId }) {
        try {
            let user = await this.mongomodels.UserModel.findById(userId);
            if (!user) {
                return { error: 'User not found' };
            }
            return { user };
        } catch (error) {
            return { error: 'An error occurred while retrieving the user' };
        }
    }
    async updateUser({ userId, updates }) {
        try {
            let user = await this.mongomodels.UserModel.findByIdAndUpdate(userId, updates, { new: true });
            if (!user) {
                return { error: 'User not found' };
            }
            return { user };
        } catch (error) {
            return { error: 'An error occurred while updating the user' };
        }
    }
    async deleteUser({ userId }) {
        try {
            let user = await this.mongomodels.UserModel.findByIdAndDelete(userId);
            if (!user) {
                return { error: 'User not found' };
            }
            return { message: 'User deleted successfully' };
        } catch (error) {
            return { error: 'An error occurred while deleting the user' };
        }
    }
    async listUsers({ page = 1, limit = 10 }) {
        try {
            let users = await this.mongomodels.UserModel.find()
                .skip((page - 1) * limit)
                .limit(limit);
            return { users };
        } catch (error) {
            return { error: 'An error occurred while listing the users' };
        }
    }
}
