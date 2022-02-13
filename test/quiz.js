

let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
const { request } = require('express');
let should = chai.should();

chai.use(chaiHttp);
let token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJrZWxseSIsInN1YiI6IjYwZDliMWFjZmZmYjU5MzNjNmNhYjNkOSIsImlhdCI6MTYyNDk3NzM2OTk5OSwiZXhwIjoxNjI1MDYzNzY5OTk5fQ.nkGdkU_zwVoHmIHZ-cN1X9yCR0qqx7LAxmaO3mx1-Vw';
let quiz_id = 1;
let url = 'http://localhost:3000';



// test GET quiz titles
describe('/GET titles', () => {
    it('it should GET all quiz titles', (done) => {
        chai.request(url)
            .get('/quiz-list')
            .set('Authorization', `Bearer ${token}`)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('array');
                done();
            })
    })
})


// test GET quiz questions
describe('/GET questions', () => {
    it('it should GET all questions for one title', (done) => {
        chai.request(url)
            .get(`/questions/${quiz_id}`)
            .set('Authorization', `Bearer ${token}`)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('array');
                done();
            })
    })
})

