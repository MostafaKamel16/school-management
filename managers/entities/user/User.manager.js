const { getSuperAdmins } = require('../../../exportSuperAdmins');
const superAdmins = getSuperAdmins();
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

        
        try {
        // Check if user already exists
        let existingUser = await this.mongomodels.UserModel.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            return { error: 'User with this email or username already exists' };
        }
         // Hash the password before saving
        user.password = await this.utils.hashPassword(password);

            // Save the user to the database
        let createdUser;
        try{
         createdUser = await this.mongomodels.UserModel.create(user);}
        catch(err){
            return this.utils.formatMongooseError(err);
        }
        // Creation Logic
        let longToken       = this.tokenManager.genLongToken({userId: createdUser._id });
        
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
    async getUser({ __headers, userId }) {
        try {
            // Make sure only user can fetch his own information
            const decoded = this.tokenManager.verifyLongToken({ token: __headers.token });
            if (!decoded || decoded.userId !== userId) {
                return { error: 'Invalid or expired token' };
            }
            let user = await this.mongomodels.UserModel.findById(userId);
            if (!user) {
                return { error: 'User not found' };
            }
            return { user };
        } catch (error) {
            return { error: 'An error occurred while retrieving the user' };
        }
    }
    async updateUser({ __headers,userId, updates }) {
        try {
            // Make sure only user can update his own information
            const decoded = this.tokenManager.verifyLongToken({ token: __headers.token });
            if (!decoded || decoded.userId !== userId) {
                return { error: 'Invalid or expired token' };
            }
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
            // Make sure only user can delete his own information
            const decoded = this.tokenManager.verifyLongToken({ token: __headers.token });
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
    async listUsers({__headers, page = 1, limit = 10 }) {
        try {
            const decoded = this.tokenManager.verifyLongToken({ token: __headers.token });
            if (!decoded ) {
                return { error: 'Invalid or expired token' };
            }
            let user = await this.mongomodels.UserModel.findById(decoded.userId);
            //only superadmins can see the list of users
            if(user.role !== 'superAdmin'){
                return { error: 'You are not authorized to perform this operation' };
            }
            let users = await this.mongomodels.UserModel.find()
                .skip((page - 1) * limit)
                .limit(limit);
            return { users };
        } catch (error) {
            console.log(error);
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

            if(superAdmins.includes(user.email)){
                user.role = 'superAdmin'
                await user.save(); 
            }
    
            // Generate tokens
            let longToken = this.tokenManager.genLongToken({ userId: user._id, userKey: user.key });
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
            return { error: 'An error occurred while logging in' };
        }
    }
}
