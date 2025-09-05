import { assert } from 'chai';
import request from 'supertest';
import app from '../server.js';

let jwtToken;
let deletedUser = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTIsImVtYWlsIjoicGFyaXhpdDE1QGdtYWlsLmNvbSIsImlhdCI6MTc1NjA5NjE4MSwiZXhwIjoxNzU2MTgyNTgxfQ.x5WfrHgJDDYE4PzXWet6Alh7I3-YpUllZXHss3c4byU';
let userWithTodos = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTMsImVtYWlsIjoicGFyaXhpdDE2QGdtYWlsLmNvbSIsImlhdCI6MTc1NjEwMTk5MSwiZXhwIjoxNzU2MTg4MzkxfQ.21QIy-yFh5TVWHuZ6WwlA_hMvmLk0aWL0oQxjK-dZZs';
let UnauthorizedUser = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTQsImVtYWlsIjoicGFyaXhpdDE3QGdtYWlsLmNvbSIsImlhdCI6MTc1NjEwMzMyMiwiZXhwIjoxNzU2MTg5NzIyfQ.ZkiFSwSQwHnbB2JlS6LzB_coz_kgOWCRQ7wxkrHhmuE';
let deleteTodo = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTQsImVtYWlsIjoicGFyaXhpdDE3QGdtYWlsLmNvbSIsImlhdCI6MTc1NjEwNDYzMiwiZXhwIjoxNzU2MTkxMDMyfQ.3bIUI0LTlf6dXs7e0GUsLao4k1d6TNYjXioohu1Q0hQ';


describe('User Signup', function () {
    it('should fail when required fields are missing', function (done) {
        request(app)
            .post('/users/signup')
            .field('name', 'parixit')
            .field('email', '')
            .field('phoneNo', '1234567890')
            .field('password', 'Password@123')
            .field('confirm_password', 'Password@123')
            .attach('profile_image', 'src/test/images/test-image.webp')
            .expect(422)
            .end((err, res) => {
                if (err) return done(err);
                assert.equal(res.body.success, false);
                assert.equal(res.body.message, 'All fields are required!');
                done();
            });
    });

    it('should fail sign up a user without profile image upload', function (done) {
        request(app)
            .post('/users/signup')
            .field('name', 'parixit')
            .field('email', 'parixit8@gmail.com')
            .field('phoneNo', '1234567890')
            .field('password', 'Password@123')
            .field('confirm_password', 'Password@123')
            .attach('profile_image', '')
            .expect(422)
            .end((err, res) => {
                if (err) return done(err);
                assert.equal(res.body.success, false);
                assert.equal(res.body.message, 'Please upload a profile image!');
                done();
            });
    });

    it('should fail when name is empty or just spaces', function (done) {
        request(app)
            .post('/users/signup')
            .field('name', '   ')
            .field('email', 'parixit8@gmail.com')
            .field('phoneNo', '1234567890')
            .field('password', 'Password@123')
            .field('confirm_password', 'Password@123')
            .attach('profile_image', 'src/test/images/test-image.webp')
            .expect(422)
            .end((err, res) => {
                if (err) return done(err);
                assert.equal(res.body.success, false);
                assert.equal(res.body.message, 'Name cannot be empty or just spaces!');
                done();
            });
    });

    it('should fail when name length is less than 3 or greater than 20', function (done) {
        request(app)
            .post('/users/signup')
            .field('name', 'abcdefghjklmnopqrstuvwxyz')
            .field('email', 'parixit8@gmail.com')
            .field('phoneNo', '1234567890')
            .field('password', 'Password@123')
            .field('confirm_password', 'Password@123')
            .attach('profile_image', 'src/test/images/test-image.webp')
            .expect(422)
            .end((err, res) => {
                if (err) return done(err);
                assert.equal(res.body.success, false);
                assert.equal(res.body.message, 'Name must be between 3 and 20 characters long!');
                done();
            });
    });

    it('should fail when name contains invalid characters', function (done) {
        request(app)
            .post('/users/signup')
            .field('name', 'John123!')
            .field('email', 'parixit8@gmail.com')
            .field('phoneNo', '1234567890')
            .field('password', 'Password@123')
            .field('confirm_password', 'Password@123')
            .attach('profile_image', 'src/test/images/test-image.webp')
            .expect(422)
            .end((err, res) => {
                if (err) return done(err);
                assert.equal(res.body.success, false);
                assert.equal(res.body.message, 'Name can only contain letters, spaces, apostrophes, or hyphens!');
                done();
            });
    });

    it('should fail when email format is invalid', function (done) {
        request(app)
            .post('/users/signup')
            .field('name', 'parixit')
            .field('email', 'invalid-email')
            .field('phoneNo', '1234567890')
            .field('password', 'Password@123')
            .field('confirm_password', 'Password@123')
            .attach('profile_image', 'src/test/images/test-image.webp')
            .expect(422)
            .end((err, res) => {
                if (err) return done(err);
                assert.equal(res.body.success, false);
                assert.equal(res.body.message, 'Invalid email format!');
                done();
            });
    });

    it('should fail when user already exists', function (done) {
        request(app)
            .post('/users/signup')
            .field('name', 'parixit')
            .field('email', 'parixit7@gmail.com')
            .field('phoneNo', '1234567890')
            .field('password', 'Password@123')
            .field('confirm_password', 'Password@123')
            .attach('profile_image', 'src/test/images/test-image.webp')
            .expect(409)
            .end((err, res) => {
                if (err) return done(err);
                assert.equal(res.body.success, false);
                assert.equal(res.body.message, 'user already exist!');
                done();
            });
    });

    it('should fail when phone number is invalid', function (done) {
        request(app)
            .post('/users/signup')
            .field('name', 'parixit')
            .field('email', 'parixit1000@gmail.com')
            .field('phoneNo', '12345')
            .field('password', 'Password@123')
            .field('confirm_password', 'Password@123')
            .attach('profile_image', 'src/test/images/test-image.webp')
            .expect(422)
            .end((err, res) => {
                if (err) return done(err);
                assert.equal(res.body.success, false);
                assert.equal(res.body.message, 'Invalid phone number. Must be a 10-digit number.');
                done();
            });
    });

    it('should fail when password does not meet criteria', function (done) {
        request(app)
            .post('/users/signup')
            .field('name', 'parixit')
            .field('email', 'parixit1000@gmail.com')
            .field('phoneNo', '1234567890')
            .field('password', 'pass')
            .field('confirm_password', 'pass')
            .attach('profile_image', 'src/test/images/test-image.webp')
            .expect(422)
            .end((err, res) => {
                if (err) return done(err);
                assert.equal(res.body.success, false);
                assert.equal(res.body.message, 'Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character.');
                done();
            });
    });

    it('should fail when passwords do not match', function (done) {
        request(app)
            .post('/users/signup')
            .field('name', 'parixit')
            .field('email', 'parixit1000@gmail.com')
            .field('phoneNo', '1234567890')
            .field('password', 'Password@123')
            .field('confirm_password', 'Password@124')
            .attach('profile_image', 'src/test/images/test-image.webp')
            .expect(422)
            .end((err, res) => {
                if (err) return done(err);
                assert.equal(res.body.success, false);
                assert.equal(res.body.message, 'Both password should be same!');
                done();
            });
    });

    // it('should sign up a user successfully with valid data and profile image upload', function(done) {
    //     request(app)
    //         .post('/users/signup')
    //         .field('name', 'parixit')
    //         .field('email', 'parixit11@gmail.com')
    //         .field('phoneNo', '1234567890')
    //         .field('password', 'Password@123')
    //         .field('confirm_password', 'Password@123')
    //         .attach('profile_image',  'src/test/images/test-image.webp')
    //         .expect(201)
    //         .end((err, res) => {
    //             if (err) return done(err);
    //             assert.equal(res.body.success, true);
    //             assert.equal(res.body.message, 'User created successfully!');
    //             assert.exists(res.body.result);
    //             assert.equal(res.body.result.name, 'parixit');
    //             assert.equal(res.body.result.email, 'parixit11@gmail.com');
    //             assert.equal(res.body.result.phoneNo, '1234567890');
    //             assert.exists(res.body.result.profile_image);
    //             done();
    //         }
    //     );
    // })
});

describe('User Login', function () {
    it('should fail when email and phoneNo are missing', function (done) {
        request(app)
            .post('/users/login')
            .send({ password: 'Password@123' })
            .expect(400)
            .end((err, res) => {
                if (err) return done(err);
                assert.equal(res.body.success, false);
                assert.equal(res.body.message, 'Email or phoneNo is required.');
                done();
            });
    });

    it('should fail when user does not exist', function (done) {
        request(app)
            .post('/users/login')
            .send({ email: 'pm@gmail.com', password: 'Password@123' })
            .expect(401)
            .end((err, res) => {
                if (err) return done(err);
                assert.equal(res.body.success, false);
                assert.equal(res.body.message, 'Invalid email or phoneNo.');
                done();
            }
            );
    });

    it('should fail when password is missing', function (done) {
        request(app)
            .post('/users/login')
            .send({ email: 'parixit8@gmail.com', password: '' })
            .expect(422)
            .end((err, res) => {
                if (err) return done(err);
                assert.equal(res.body.success, false);
                assert.equal(res.body.message, 'Please enter password is required!');
                done();
            }
            );
    });

    it('should fail when password is incorrect', function (done) {
        request(app)
            .post('/users/login')
            .send({ email: 'parixit8@gmail.com', password: 'WrongPassword@123' })
            .expect(401)
            .end((err, res) => {
                if (err) return done(err);
                assert.equal(res.body.success, false);
                assert.equal(res.body.message, 'Invalid credentials!');
                done();
            }
            );
    });

    it('should fail when user is deleted', function (done) {
        request(app)
            .post('/users/login')
            .send({ email: 'parixit10@gmail.com', password: 'Password@123' })
            .expect(400)
            .end((err, res) => {
                if (err) return done(err);
                assert.equal(res.body.success, false);
                assert.equal(res.body.message, 'User does not exist!');
                done();
            }
            );
    });

    it('should log in a user successfully with valid credentials', function (done) {
        request(app)
            .post('/users/login')
            .send({ email: 'parixit11@gmail.com', password: 'Password@123' })
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                assert.equal(res.body.success, true);
                assert.equal(res.body.message, 'Login successful!');
                assert.exists(res.body.jwtToken);
                jwtToken = res.body.jwtToken;
                done();
            }
            );
    });

});

describe('getUser Profile', function () {
    it('should fail when JWT token is missing', function (done) {
        request(app)
            .get('/users/getUser')
            .expect(401)
            .end((err, res) => {
                if (err) return done(err);
                assert.equal(res.body.success, false);
                assert.equal(res.body.message, 'No token provided.');
                done();
            }
            );
    });

    it('should fail when JWT token is invalid', function (done) {
        request(app)
            .get('/users/getUser')
            .set('authorization', 'Bearer invalidtoken')
            .expect(403)
            .end((err, res) => {
                if (err) return done(err);
                assert.equal(res.body.success, false);
                assert.equal(res.body.message, 'Failed to authenticate token.');
                done();
            }
            );
    });

    it('should fail when User is not found', function (done) {
        request(app)
            .get('/users/getUser')
            .set('authorization', deletedUser)
            .expect(400)
            .end((err, res) => {
                if (err) return done(err);
                assert.equal(res.body.success, false);
                assert.equal(res.body.message, 'User is not found.');
                done();
            }
        );
    });

    it ('should retrieve user profile successfully with valid JWT token', function(done) {
        request(app)
            .get('/users/getUser')
            .set('authorization', jwtToken)
            .expect(200)
            .end((err, res) => {    
                if (err) return done(err);
                assert.equal(res.body.success, true);
                assert.equal(res.body.message, 'User fetched successfully');
                assert.exists(res.body.result);
                assert.equal(res.body.result.email, 'parixit11@gmail.com');
                done();
            }
        );  
    });
});

describe('Update user ', function () {
    it('should fail when JWT token is missing', function (done) {
        request(app)
            .put('/users/updateUser')
            .expect(401)
            .end((err, res) => {
                if (err) return done(err);
                assert.equal(res.body.success, false);
                assert.equal(res.body.message, 'No token provided.');
                done();
            }
            );
    });

    it('should fail when JWT token is invalid', function (done) {
        request(app)
            .put('/users/updateUser')
            .set('authorization', 'Bearer invalidtoken')
            .expect(403)
            .end((err, res) => {
                if (err) return done(err);
                assert.equal(res.body.success, false);
                assert.equal(res.body.message, 'Failed to authenticate token.');
                done();
            }
            );
    });

    it('should fail when User is not found', function (done) {
        request(app)
            .put('/users/updateUser')
            .set('authorization', deletedUser)
            .send({ name: 'New Name' })
            .expect(404)
            .end((err, res) => {
                if (err) return done(err);
                assert.equal(res.body.success, false);
                assert.equal(res.body.message, 'User is not found.');
                done();
            }
        );
    });

    it('should fail when name is empty or just spaces', function (done) {
        request(app)
            .put('/users/updateUser')
            .set('authorization', jwtToken)
            .send({ name: '   ' })
            .expect(422)
            .end((err, res) => {
                if (err) return done(err);
                assert.equal(res.body.success, false);
                assert.equal(res.body.message, 'Name cannot be empty or just spaces!');
                done();
            });
    });

    it('should fail when name length is less than 3 or greater than 20', function (done) {
        request(app)
            .put('/users/updateUser')
            .set('authorization', jwtToken)
            .send({ name: 'ab' })
            .expect(422)
            .end((err, res) => {
                if (err) return done(err);
                assert.equal(res.body.success, false);
                assert.equal(res.body.message, 'Name must be between 3 and 20 characters long!');
                done();
            });
    });

    it('should fail when name contains invalid characters', function (done) {
        request(app)
            .put('/users/updateUser')
            .set('authorization', jwtToken)
            .send({ name: 'Invalid@Name!' })
            .expect(422)
            .end((err, res) => {
                if (err) return done(err);
                assert.equal(res.body.success, false);
                assert.equal(res.body.message, 'Name can only contain letters, spaces, apostrophes, or hyphens!');
                done();
            });
    });

    it('should update user name successfully with valid data and JWT token', function (done) {
        request(app)
            .put('/users/updateUser')
            .set('authorization', jwtToken)
            .send({ profile_image: 'src/test/images/test-image.webp', name: 'New Name' })
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                assert.equal(res.body.success, true);
                assert.equal(res.body.message, 'User updated successfully');
                assert.exists(res.body.result);
                done();
            });
    });
});

describe('Create todo' , function() {
    it('should fail when JWT token is missing', function (done) {
        request(app)
            .post('/todos/createTodo')
            .expect(401)
            .end((err, res) => {
                if (err) return done(err);
                assert.equal(res.body.success, false);
                assert.equal(res.body.message, 'No token provided.');
                done();
            }
        );
    });

    it('should fail when JWT token is invalid', function (done) {
        request(app)
            .post('/todos/createTodo')
            .set('authorization', 'Bearer invalidtoken')
            .expect(403)
            .end((err, res) => {
                if (err) return done(err);
                assert.equal(res.body.success, false);
                assert.equal(res.body.message, 'Failed to authenticate token.');
                done();
            }
            );
    });

    it('should fail when user is not found', function (done) {
        request(app)
            .post('/todos/createTodo')
            .set('authorization', deletedUser)
            .send({ title: 'New Todo', description: 'This is a new todo item.' })
            .expect(404)
            .end((err, res) => {
                if (err) return done(err);
                assert.equal(res.body.success, false);
                assert.equal(res.body.message, 'User not found.');
                done();
            });
    });

    it('should fail when title is empty', function (done) {
        request(app)
            .post('/todos/createTodo')
            .set('authorization', jwtToken)
            .send({ title: '', description: 'This is a new todo item.' })
            .expect(422)
            .end((err, res) => {
                if (err) return done(err);
                assert.equal(res.body.success, false);
                assert.equal(res.body.message, 'Title is required.');
                done();
            });
    });

    it('should create todo successfully with valid data and JWT token', function (done) {
        request(app)
            .post('/todos/createTodo')
            .set('authorization', jwtToken)
            .send({ title: 'New Todo', description: 'This is a new todo item.' })
            .expect(201)
            .end((err, res) => {
                if (err) return done(err);
                assert.equal(res.body.success, true);
                assert.equal(res.body.message, 'Todo created successfully');
                assert.exists(res.body.result);
                done();
            });
    });
});

describe('Get todos' , function() {
    it('should fail when JWT token is missing', function (done) {
        request(app)
            .get('/todos/getTodos')
            .expect(401)
            .end((err, res) => {
                if (err) return done(err);
                assert.equal(res.body.success, false);
                assert.equal(res.body.message, 'No token provided.');
                done();
            });
    });

    it('should fail when JWT token is invalid', function (done) {
        request(app)
            .get('/todos/getTodos')
            .set('authorization', 'Bearer invalidtoken')
            .expect(403)
            .end((err, res) => {
                if (err) return done(err);
                assert.equal(res.body.success, false);
                assert.equal(res.body.message, 'Failed to authenticate token.');
                done();
            });
    });

    it('should fail when user is not found', function (done) {
        request(app)
            .get('/todos/getTodos')
            .set('authorization', deletedUser)
            .expect(404)
            .end((err, res) => {
                if (err) return done(err);
                assert.equal(res.body.success, false);
                assert.equal(res.body.message, 'User not found.');
                done();
            });
    });

    it('should fetch todos successfully with valid JWT token', function (done) {
        request(app)
            .get('/todos/getTodos')
            .set('authorization', jwtToken)
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                assert.equal(res.body.success, true);
                assert.equal(res.body.message, 'Todos fetched successfully');
                assert.exists(res.body.result);
                done();
            });
    });
});

describe('Update todos', function() {
    it('should fail when JWT token is missing', function (done) {
        request(app)
            .put('/todos/updateTodo/1')
            .expect(401)
            .end((err, res) => {
                if (err) return done(err);
                assert.equal(res.body.success, false);
                assert.equal(res.body.message, 'No token provided.');
                done();
            }
            );
    });

    it('should fail when JWT token is invalid', function (done) {
        request(app)
            .put('/todos/updateTodo/1')
            .set('authorization', 'Bearer invalidtoken')
            .expect(403)
            .end((err, res) => {
                if (err) return done(err);
                assert.equal(res.body.success, false);
                assert.equal(res.body.message, 'Failed to authenticate token.');
                done();
            }
            );
    });

    it('should fail when user is not found', function (done) {
        request(app)
            .put('/todos/updateTodo/6')
            .set('authorization', deletedUser)
            .send({ title: 'Updated Todo', description: 'This is an updated todo item.' })
            .expect(404)
            .end((err, res) => {
                if (err) return done(err);
                assert.equal(res.body.success, false);
                assert.equal(res.body.message, 'User not found.');
                done();
            });
    });

    it('should fail when todo is not found', function (done) {
        request(app)
            .put('/todos/updateTodo/9999')
            .set('authorization', jwtToken)
            .send({ title: 'Updated Todo', description: 'This is an updated todo item.' })
            .expect(404)
            .end((err, res) => {
                if (err) return done(err);
                assert.equal(res.body.success, false);
                assert.equal(res.body.message, 'Todo not found.');
                done();
            });
    });

    it('should fail when user is not authorized', function (done) {
        request(app)
            .put('/todos/updateTodo/1')
            .set('authorization', UnauthorizedUser)
            .send({ title: 'Updated Todo', description: 'This is an updated todo item.' })
            .expect(403)
            .end((err, res) => {
                if (err) return done(err);
                assert.equal(res.body.success, false);
                assert.equal(res.body.message, 'You are not authorized to update this todo.');
                done();
            });
    });

    it('should fail when trying to update a deleted todo', function (done) {
        request(app)
            .put('/todos/updateTodo/5')
            .set('authorization', deleteTodo)
            .send({ title: 'Updated Todo', description: 'This is an updated todo item.' })
            .expect(400)
            .end((err, res) => {
                if (err) return done(err);
                assert.equal(res.body.success, false);
                assert.equal(res.body.message, 'Cannot update a deleted todo.');
                done();
            });
    });

    it('should update todo successfully with valid data and JWT token', function (done) {
        request(app)
            .put('/todos/updateTodo/18')
            .set('authorization', jwtToken)
            .send({ title: 'helio todo', description: 'This is an updated todo item.' })
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                assert.equal(res.body.success, true);
                assert.equal(res.body.message, 'Todo updated successfully');
                assert.exists(res.body.result);
                done();
            });
    });
});

describe('Delete todos', function() {
    it('should fail when JWT token is missing', function (done) {
        request(app)
            .delete('/todos/deleteTodo/1')
            .expect(401)
            .end((err, res) => {
                if (err) return done(err);
                assert.equal(res.body.success, false);
                assert.equal(res.body.message, 'No token provided.');
                done();
            });
    });

    it('should fail when JWT token is invalid', function (done) {
        request(app)
            .delete('/todos/deleteTodo/1')
            .set('authorization', 'Bearer invalidtoken')
            .expect(403)
            .end((err, res) => {
                if (err) return done(err);
                assert.equal(res.body.success, false);
                assert.equal(res.body.message, 'Failed to authenticate token.');
                done();
            });
    });

    it('should fail when user is not found', function (done) {
        request(app)
            .delete('/todos/deleteTodo/6')
            .set('authorization', deletedUser)
            .expect(404)
            .end((err, res) => {
                if (err) return done(err);
                assert.equal(res.body.success, false);
                assert.equal(res.body.message, 'User not found.');
                done();
            });
    });

    it('should fail when todo is not found', function (done) {
        request(app)
            .delete('/todos/deleteTodo/9999')
            .set('authorization', jwtToken)
            .expect(404)
            .end((err, res) => {
                if (err) return done(err);
                assert.equal(res.body.success, false);
                assert.equal(res.body.message, 'Todo not found.');
                done();
            });
    });

    it('should fail when user is not authorized', function (done) {
        request(app)
            .delete('/todos/deleteTodo/1')
            .set('authorization', UnauthorizedUser)
            .expect(403)
            .end((err, res) => {
                if (err) return done(err);
                assert.equal(res.body.success, false);
                assert.equal(res.body.message, 'You are not authorized to delete this todo.');
                done();
            });
    });

    it('should fail when trying to delete a deleted todo', function (done) {
        request(app)
            .delete('/todos/deleteTodo/5')
            .set('authorization', deleteTodo)
            .expect(400)
            .end((err, res) => {
                if (err) return done(err);
                assert.equal(res.body.success, false);
                assert.equal(res.body.message, 'Todo is already deleted.');
                done();
            });
    });

    it('should delete todo successfully with valid data and JWT token', function (done) {
        request(app)
            .delete('/todos/deleteTodo/18')
            .set('authorization', jwtToken)
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                assert.equal(res.body.success, true);
                assert.equal(res.body.message, 'Todo deleted successfully');
                assert.exists(res.body.result);
                done();
            });
    });
});

describe('Delete user' ,function(){
     it('should fail when JWT token is missing', function (done) {
        request(app)
            .delete('/users/deleteUser')
            .expect(401)
            .end((err, res) => {
                if (err) return done(err);
                assert.equal(res.body.success, false);
                assert.equal(res.body.message, 'No token provided.');
                done();
            }
            );
    });

    it('should fail when JWT token is invalid', function (done) {
        request(app)
            .delete('/users/deleteUser')
            .set('authorization', 'Bearer invalidtoken')
            .expect(403)
            .end((err, res) => {
                if (err) return done(err);
                assert.equal(res.body.success, false);
                assert.equal(res.body.message, 'Failed to authenticate token.');
                done();
            }
            );
    });

    it('should fail when User is not found', function (done) {
        request(app)
            .delete('/users/deleteUser')
            .set('authorization', deletedUser)
            .expect(404)
            .end((err, res) => {
                if (err) return done(err);
                assert.equal(res.body.success, false);
                assert.equal(res.body.message, 'User is not found.');
                done();
            }
        );
    });

    it('should fail when user has associated todos', function (done) {
        request(app)
            .delete('/users/deleteUser')
            .set('authorization', userWithTodos)
            .expect(400)
            .end((err, res) => {
                if (err) return done(err);
                assert.equal(res.body.success, false);
                assert.equal(res.body.message, 'User has associated todos and cannot be deleted.');
                done();
            });
    });

    it('should delete user successfully with valid JWT token', function (done) {
        request(app)
            .delete('/users/deleteUser')
            .set('authorization', jwtToken)
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                assert.equal(res.body.success, true);
                assert.equal(res.body.message, 'User account deleted successfully.');
                done();
            });
    });
});