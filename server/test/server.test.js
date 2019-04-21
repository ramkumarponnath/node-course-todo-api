const expect = require('expect');
const request = require('supertest');
const {app} = require('./../server');
const {Todo} = require('./../models/todo');
const {User} = require('./../models/user');
const {ObjectID} = require('mongodb');
const {todos, populateTodos, users, populateUsers} = require('./seed/seed');
const bcrypt = require('bcryptjs');

beforeEach(populateUsers);
beforeEach(populateTodos);

describe('POST /todos', () => {
    it('should create a new todo', (done) => {
        let text = 'First test todo';
        request(app)
            .post('/todos')
            .send({text})
            .expect(200)
            .expect((res) => {
                expect(res.body.text).toBe(text)
            })
            .end((err,res) => {
                if(err){
                    return done(err);
                }
                Todo.find().then((todos) => {
                    expect(todos.length).toBe(3);
                    expect(todos[0].text).toBe(text);
                    done();
                })
                .catch(err => done(err));
            })
    });

    it('should not create todo with invalid body data', (done) => {
        request(app)
            .post('/todos')
            .send()
            .expect(400)
            .end((err, res) => {
                if(err){
                    return done(err);
                }
                Todo.find().then((todos) => {
                    expect(todos.length).toBe(2);
                    done();
                })
                .catch(e => done(e));
            })
    });
});

describe('GET /todos', () => {
    it('should get all todos', (done) => {
        request(app)
            .get('/todos')
            .expect(200)
            .expect((res) => {
                expect(res.body.todos.length).toBe(2);
            })
            .end(done);
    });
});

describe('Get /todos/:id', () => {
    it('it should return todo doc' , (done) => {
        request(app)
            .get(`/todos/${todos[0]._id.toHexString()}`)
            .expect(200)
            .expect(res => {
                expect(res.body.todo.text).toBe(todos[0].text);
            })
            .end(done);
    });
    it('should return 404 if todo not found', (done) => {
        const hexId = new ObjectID().toHexString();
        request(app)
            .get(`/todos/${hexId}`)
            .expect(404)
            .end(done);
    });
    it('should return 400 if invalid todo', (done) => {
        request(app)
            .get(`/todos/1234a`)
            .expect(400)
            .end(done);
    })
});

describe('DELETE /todos:id', () => {
    it('should delete a todo', (done) => {
        request(app)
            .delete(`/todos/${todos[1]._id.toHexString()}`)
            .expect(200)
            .expect(res => {
                expect(res.body.todo.text).toBe(todos[1].text);
            })
            .end((err,res) => {
                if(err) {
                    return done(err);
                }
                Todo.findById(todos[1]._id.toHexString()).then(todo => {
                    expect(todo).toBeFalsy();
                    done();
                }).catch(err => done(err))
            }); 
    });
    it('should return 404 if todo not found', (done) => {
        const id = new ObjectID().toHexString();
        request(app)
            .delete(`/todos/${id}`)
            .expect(404)
            .end(done);
    });
    it('should return 400 if invalid todo', (done) => {
        request(app)
            .delete(`/todos/1234`)
            .expect(400)
            .end(done);
    });
});

describe('PATCH /todos:id', () => {
    it('should update the todo', (done) => {
        const id = todos[0]._id.toHexString();
        let body = {text:'Test Update', completed:true};
        request(app)
            .patch(`/todos/${id}`)
            .send(body)
            .expect(200)
            .expect(res => {
                expect(res.body.todo.text).toBe(body.text);
                expect(res.body.todo.completed).toBe(true);
                expect(typeof res.body.todo.completedAt).toBe('number');
            })
            .end((err, res) => {
                if(err){
                    return done(err);
                }
                Todo.findById(id).then(todo => {
                    expect(todo.text).toBe(body.text);
                    expect(typeof todo.completedAt).toBe('number');
                    done();
                }).catch(err => done(err))
            })
    });
    it('should clear completedAt when completed is false', (done) => {
        const id = todos[1]._id.toHexString();
        request(app)
            .patch(`/todos/${id}`)
            .send({completed:false})
            .expect(200)
            .expect(res => {
                expect(res.body.todo.completed).toBe(false);
                expect(res.body.todo.completedAt).toBeFalsy();
            })
            .end((err, res) => {
                if(err){
                    return done(err);
                }
                Todo.findById(id).then(todo => {
                    expect(todo.completed).toBe(false);
                    expect(todo.completedAt).toBeFalsy();
                    done();
                }).catch(err => done(err))
            })
    });
});

describe('GET /users/me', () => {
    it('should return user if authenticated', (done) => {
        request(app)
            .get('/users/me')
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .expect((res) => {
                expect(res.body._id).toBe(users[0]._id.toHexString());
                expect(res.body.email).toBe(users[0].email);
            })
            .end(done);
    });
    it('should return 401 if not authenticated', (done) => {
        request(app)
            .get('/users/me')
            .set('x-auth','112435346ydfhdgsfssgsdg')
            .expect(401)
            .expect((res) => {
                expect(res.body).toEqual({})
            })
            .end(done);
    });
});

describe('POST /users', () => {
    it('should create a user', (done) => {
      let email = 'example@example.com';
      let password = '123mnb!test';
  
      request(app)
        .post('/users')
        .send({email, password})
        .expect(200)
        .expect((res) => {
          expect(res.headers['x-auth']).toBeTruthy();
          expect(res.body._id).toBeTruthy();
          expect(res.body.email).toBe(email);
        })
        .end((err,res) => {
          if (err) {
            return done(err);
          }
  
          User.findOne({email}).then((user) => {
            expect(user).toBeTruthy();
            expect(user.password).toNotBe(password);
            done();
          }).catch(e => done(e));
        });
    });
  
    it('should return validation errors if request invalid', (done) => {
      request(app)
        .post('/users')
        .send({
          email: 'and',
          password: '123'
        })
        .expect(400)
        .end(done);
    });
  
    it('should not create user if email in use', (done) => {
      request(app)
        .post('/users')
        .send({
          email: users[0].email,
          password: 'Password123!'
        })
        .expect(400)
        .end(done);
    });
  });

  describe('POST /users/login', () => {
      it('should login user an return auth token', (done) => {
        request(app)
            .post('/users/login')
            .send({
                email: users[1].email,
                password:users[1].password
            })
            .expect(200)
            .expect((res) => {
                expect(res.headers['x-auth']).toBeTruthy();
                expect(res.body.email).toBe(users[1].email);
                expect(res.body._id).toBe(users[1]._id.toHexString());
            })
            .end((err,res) => {
                if(err) {
                    return done(err);
                }
                User.findById(users[1]._id).then((user) => {
                    expect(user.password).toBeTruthy();
                    expect(user.tokens[0]).toMatchObject({
                        access:'auth',
                        token:res.headers['x-auth']
                    });
                    done();
                }).catch(e => done(e));
            })
      });
      it('should reject invalid login', (done) => {
        request(app)
            .post('/users/login')
            .send({
                email:users[1].email,
                password:'test123'
            })
            .expect(400)
            .expect((res) => {
                expect(res.headers['x-auth']).toBeFalsy();
            })
            .end((err,res) => {
                if(err) {
                    return done(err);
                }
                User.findById(users[1]._id).then((user) => {
                    expect(user.tokens.length).toBe(0);
                    done();
                }).catch(e => done(e));
            });
                
      });
  })