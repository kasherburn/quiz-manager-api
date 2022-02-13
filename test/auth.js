let mongoose = require('mongoose')
let chai = require('chai');
let chaiHttp = require('chai-http');
const { request } = require('express');
let should = chai.should();

chai.use(chaiHttp);

let url = 'http://localhost:3000';
let user = { 'username': 'edit@email.com', 'password': 'password', 'permissions': 'Edit' }


//test auth endpoint
describe('/POST auth', () => {
    it('it should log user in', (done) => {
        chai.request(url)
            .post('/auth')
            .send(user)
            .end((err, res) => {
                res.should.have.status(200);
                done();
            })
    })
})

// test register endpoint
describe('/POST register', () => {
    it('it create user', (done) => {
        chai.request(url)
            .post('/register')
            .send(user)
            .end((err, res) => {
                res.should.have.status(200);
                done();
            })
    })
})