const chai = require('chai');
const supertest = require("supertest");
const fs = require('fs')
const chaiJsonSchema = require('chai-json-schema')

const baseURL = "https://api.restful-api.dev";

chai.use(chaiJsonSchema)
const expect = chai.expect;

describe("restful-api-dev API Test", () => {
    var createId;
    it("TC1 - Get Single Object", async () => {

        const schema = JSON.parse(fs.readFileSync("resource/schema/get_single_object_schema.json", 'utf8'));

        const response = await supertest(baseURL).get("/objects/7");

        console.log(response.body)
        expect(response.status).to.equal(200)
        expect(response.body.id).to.equal("7")
        expect(response.body.data.year).to.equal(2019)
        expect(response.body.data['CPU model']).to.contain("Intel")

        expect(response.body).to.be.jsonSchema(schema)
    });

    it('TC2 - Post Object', async () => {
        const body = {
            "name": "Apple MacBook Pro 16",
            "data": {
               "year": 2019,
               "price": 1849.99,
               "CPU model": "Intel Core i9",
               "Hard disk size": "1 TB"
            }
         }

        const response = await supertest(baseURL).post("/objects")
        .send(body);

       ///console.log(response.body)
       createdId = response.body.id
    });

    it('TC3 - Put Object', async () => {
        const body = {
            "name": "Apple MacBook Pro 16",
            "data": {
               "year": 2019,
               "price": 2049.99,
               "CPU model": "Intel Core i9",
               "Hard disk size": "1 TB",
               "color": "silver"
            }
         }

        const response = await supertest(baseURL).put(`/objects/${createdId}`)
        .send(body);

       console.log(response.body)
       createdId = response.body.id
    });

    it("TC4 - DELETE Single Object", async () => {
        const response = await supertest(baseURL)
            .delete(`/objects/${createdId}`);
        expect(response.status).to.equal(200)
    });

    it("TC5 - GET Single Object With Invalid Id", async () => {
        const response = await supertest(baseURL)
            .get("/objects/999999999999999999999999999999999999999999999999999999999999");

        console.log(response.body)
        expect(response.status).to.equal(404)
        expect(response.body.error).to.contain("was not found")
    });
});