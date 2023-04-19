/// <reference types="Cypress" />


describe('APICallsTCs', () => {

    let data;
    let userId
    
    before(() => {
        cy.fixture('../fixtures/testdata.json').then((fData) => {
            data = fData;
        });
    });
    it('AddUserUsingAPI', () => {
        cy.request('POST',"/user",{
            "name": data.name,
            "username": data.userName,
            "email": data.email,
            "phone": data.phone 
        }).then((response) => {
        return new Promise(resolve => { 
            expect(response.body).to.have.property('name', data.name)        
            expect(response).property('status').to.equal(201)
            expect(response.body).property('id').to.not.be.oneOf([null, ""])
            const respBody = response.body;
            userId = respBody['id']
            resolve(userId)
        })
    })
})

    it('GetAllUsersUserUsingAPI', () => {
        cy.request("/user").then((response)=>{
            expect(response).property('status').to.equal(200)
        })
    })

    it('GetAUserUsingAPI', () => {
        cy.request("/user/" + userId).then((response)=>{
            expect(response).property('status').to.equal(200)
            expect(response.body).to.have.property('name', data.name) 
        })
    })

    it('EditUserUsingAPI', () => {
        cy.request('PUT',"/user/" + userId,{
            "name": data.updatedName,
            "username":data.updatedUserName,
            "email": data.email,
            "phone": data.phone
        }).then((response) => { 
            expect(response.body).to.have.property('name', data.updatedName)        
            expect(response).property('status').to.equal(200)
            expect(response.body).to.have.property('id').equals(userId)
        })
    })

    it('DeleteUserUsingAPI', () => {
        cy.request('DELETE',"/user/" + userId).then((response) => {        
            expect(response).property('status').to.equal(200)
        })
    })

    let url = "/user/" + userId
    it('GetAUserUsingAPI', () => {
        cy.request({url, failOnStatusCode:false}).then((response)=>{
            expect(response.status).to.equal(404)
        })
    })
})
