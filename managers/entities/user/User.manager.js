module.exports = class User { 

    constructor({utils, cache, config, cortex, managers, validators, mongomodels }={}){
        this.config              = config;
        this.cortex              = cortex;
        this.validators          = validators; 
        this.mongomodels         = mongomodels;
        this.tokenManager        = managers.token;
        this.usersCollection     = "users";
        this.httpExposed         = ['post=createUser', 'get=getUser', 'put=updateUser','delete=deleteUser', 'get=listUsers', 'post=loginUser'];
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
    async deleteUser({__headers, userId}) {
        try {
            console.log('headers',__headers.token)
            const decoded = this.tokenManager.verifyShortToken({ token: __headers.token });
            if (!decoded || decoded.userId !== userId) {
                return { error: 'Invalid or expired token' };
            }
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
    async loginUser(req) {
        try {
            const { username, password } = req;
            // Find the user by username
            let user = await this.mongomodels.UserModel.findOne({ username });
            if (!user) {
                return { error: 'Invalid username or password' };
            }
    
            // Validate the password
            let isPasswordValid = await this.utils.comparePassword(password, user.password);
            if (!isPasswordValid) {
                return { error: 'Invalid username or password' };
            }
    
            // Generate tokens
            let longToken = this.tokenManager.genLongToken({ userId: user._id, userKey: user.key });
            console.log('longToken', longToken);
            let shortTokenResponse = this.tokenManager.v1_createShortTokenFromLongToken({
                __longToken: longToken,
                __device: req.__device
            });
            
            if (shortTokenResponse.error) {
                return { error: 'An error occurred while generating short token' };
            }
            
            let shortToken = shortTokenResponse.shortToken;
    
            // Respond with tokens
            return {
                user,
                longToken,
                shortToken
            };
        } catch (error) {
            console.log(error);
            return { error: 'An error occurred while logging in' };
        }
    }
}
