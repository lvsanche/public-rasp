var expect = require('expect');
var configs = require('../../shared/configs/config');
var request = require('request');
var User = require('../../models/user');
var mongoose = require('mongoose');

describe('Sign Up Router', () => {
    describe('GET /signUp', () => {
        it("should return the sign up page HTML", (done) => {
            request('http://'+configs.host+':'+configs.port+'/signUp', function(err,resp,body){
                expect(err).toBeFalsy();
                const headers = resp['headers'];
                expect(headers['content-type']).toBe('text/html');
                done(); 
            }); 
        }); 
    });

    describe('POST /signUp', () => {
        const form = {
            email: 'test123@gmail.com',
            fname: 'Testing123',
            lname: 'LastName',
            password: 'asdfgh123'
        };

        //connecting to the DB
        before( (done) => {
            mongoose.connect(configs.mongoURL);
            const db = mongoose.connection;
            db.on('error', console.error.bind(console, 'connection error'));
            db.once('open', function() {
                console.log('We are connected to test database!');
                done();
            });
        })
       

        it ("should make a user in the DB & redirect", (done) => {
            request.post({
                url:'http://'+configs.host+':'+configs.port+'/signUp',
                form: form},
                function(err, response, body){
                    expect(err).toBeFalsy();
                    expect(response.statusCode).toBe(302);
                    var headers = response['headers'];
                    expect(headers['location']).toBe('/calendar/new');
                    
                  
                    User.findOne({email: form.email}, function(err, res){
                        expect(err).toBeFalsy();
                        // console.log(res);
                    
                        expect(res.email).toBe(form.email);
                        expect(res.name.firstName).toBe(form.fname);
                        expect(res.name.lastName).toBe(form.lname);
                        done();
                    });
                })
        })

        it( "should handle double email sign up", (done) => {
            request.post({
                url:'http://'+configs.host+':'+configs.port+'/signUp',
                form: form},
                function(err, response, body){
                    console.log(response.statusCode);
                    request.post({
                        url:'http://'+configs.host+':'+configs.port+'/signUp',
                        form: form},
                        function(err, response, body){
                            
                            expect(err).toBeFalsy();
                            expect(response.statusCode).toBe(200);
                            // console.log(body);
                            done();
                    })
            })
        })

        after( (done) => {
            //need to clean the db
            
            mongoose.connection.close(done);
        
            User.findOneAndRemove({email: form.email}, function (err, res){
                //need to confirm deletion
                expect(err).toBeFalsy();
                mongoose.connection.close(done);
                
            });
        })
    })

});