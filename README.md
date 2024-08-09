# School Mangemenet Application

This is a school management application that allows users to perform basic CRUD operations on three main entities: School, Classroom, and Student. The application should provide APIs that enable the management of these entities. Superadmins will have the ability to add schools, while school admins can manage classrooms and students within their respective schools.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Endpoints](#endpoints)
- [Contributing](#contributing)
- [Contact](#contact)


## Installation

-- The application is deployed on heroku , The infrastructure consists of a DB, it is a MongoDb hosted on Mongo Atlas and redis instance hosted on Redis Labs. 

To Access the deployed application, Here is an example of one of the routes ,
[https://school-management-mostafa-df166f6a3694.herokuapp.com/api/user/listUsers](https://school-management-mostafa-df166f6a3694.herokuapp.com/api/user/listUsers)

### Running Locally

To run the application locally, follow these steps:

1. **Clone the repository**:
    ```sh
    git clone https://github.com/your-username/school-management-application.git
    cd school-management-application
    ```

2. **Install dependencies**:
    ```sh
    npm install
    ```

3. **Set up environment variables**:
   .env file should not be in the remote repo, but for the sake of the project, I left in the repo to be able to use my remote resources when you run app locally.
    ```

4. **Run the application**:
    ```sh
    npm start
    ```

Later there is a detailed explanation of the routes 

## Usage 
1) create a user with username, email and password 
2) if you want the user to be able to access all endpoints, add the email to listOfSuperAdmins.json , We wanted to act like a real sceanrio where you get your access when you login 
3) When you login, you get long token and short token, copy the long token
4) add to headers a token and set its value as the copied long token.
5) if the user is superadmin, he will be able to create a school.
6) create a school, add admins for this school, only admins for a certain school can create classrooms and students for this school.

## Endpoints

### User Manager
- `POST /createUser`
- `GET /getUser`
- `PUT /updateUser`
- `DELETE /deleteUser`
- `GET /listUsers`
- `POST /login`

### Student Manager
- `POST /createStudent`
- `GET /getStudent`
- `PUT /updateStudent`
- `DELETE /deleteStudent`

### School Manager
- `POST /createSchool`
- `GET /getSchool`
- `PUT /updateSchool`
- `DELETE /deleteSchool`
- `GET /listSchools`
- `POST /addSchoolAdmins`

### Classroom Manager
- `POST /createClassroom`
- `GET /getClassroom`
- `PUT /updateClassroom`
- `DELETE /deleteClassroom`


Example : https://school-management-mostafa-df166f6a3694.herokuapp.com/api/user/listUsers
          https://school-management-mostafa-df166f6a3694.herokuapp.com/api/user/loginUser
          https://school-management-mostafa-df166f6a3694.herokuapp.com/api/school/createSchool
          https://school-management-mostafa-df166f6a3694.herokuapp.com/api/classroom/deleteClassroom
        
## Contributing

We welcome contributions to the School Management Application! To contribute, please follow these steps:

1. **Fork the repository**: Click the "Fork" button at the top right corner of the repository page to create a copy of the repository on your GitHub account.

2. **Clone your fork**: Clone your forked repository to your local machine.
    ```sh
    git clone https://github.com/your-username/school-management-application.git
    cd school-management-application
    ```

3. **Create a new branch**: Create a new branch for your feature or bugfix.
    ```sh
    git checkout -b feature-name
    ```

4. **Make your changes**: Make your changes to the codebase.

5. **Commit your changes**: Commit your changes with a descriptive commit message.
    ```sh
    git add .
    git commit -m "Description of the feature or fix"
    ```

6. **Push to your fork**: Push your changes to your forked repository.
    ```sh
    git push origin feature-name
    ```

7. **Open a pull request**: Go to the original repository on GitHub and open a pull request from your forked repository. Provide a clear description of your changes and any related issue numbers.

8. **Review process**: Your pull request will be reviewed by the maintainers. Please be responsive to any feedback or requests for changes.

### Guidelines

- Ensure your code follows the project's coding standards.
- Write clear and concise commit messages.
- Update documentation as necessary.
- Write tests for new features or bug fixes.

Thank you for contributing to the School Management Application!

## Contact

If you have any questions, suggestions, or issues, please feel free to contact us:

- **Email**: [mostafa.ehab.ezzeldin@gmail.com](mailto:mostafa.ehab.ezzeldin@gmail.com)
