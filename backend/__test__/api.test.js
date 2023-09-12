const request = require('supertest');
const app = require('../app');
 
// Get testing
 
describe('Get /fetch', () => {
    it('Should return set of data', async() => {
        const res= await request(app).get('/')
        expect(res.status).toBe(200);
    })
 
    it('Response time should be less than 200ms', async() => {
        const startTime = Date.now();
        const res = await request(app).get('/')
        const endTime = Date.now();
        const resTime = endTime - startTime;
        expect(res.status).toBe(200);
        expect(resTime).toBeLessThan(200);
    })

    it('Response data should be an array', async() => {
        const res = await request(app).get('/');
        expect(Array.isArray(res.body)).toBe(true);
    })

    it("Error -> Data does not exists",async() => {
        const res = await request(app).get('/');
        expect(res.status).toBe(500);
    })
})

// update testing

// describe("Update /edit data", () => {

//     it('Should edit the data in the backend', async() => {
//         const payload = {"role" : "Reviewer", "id" : 3}
//         const res = await request(app).put('/updateuserdata/:id').send(payload);
//         expect(res.status).toBe(200);
//     })

//     it('Should edit data within 200ms', async() => {
//         const payload = {"role" : "Translator", "id" : 4}
//         const startTime = Date.now();
//         const res = await request(app).put('/updateuserdata/:id').send(payload);
//         const endTime = Date.now();
//         const resTime = endTime - startTime;
//         expect(res.status).toBe(200);
//         expect(resTime).toBeLessThan(200);
//     })

//     it('Error -> ID does exists', async() => {
//         const payload = {"role" : "Reviewer", "id" : 25}
//         const res = await request(app).put('/updateuserdata:/id').send(payload);
//         expect(res.status).toBe(404);
//     })

// })