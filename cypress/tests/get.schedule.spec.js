let currentDate = new Date().toJSON().slice(0, 10)

describe('GET /schedule endpoint tests', () => {
    context('Request with correct parameters', () => {
        it('Verify request with default parameters response', () => {
            cy.request(
                'https://api.tvmaze.com/schedule'
            ).should((response) => {
                expect(response.status).to.eq(200)
                response.body.forEach((element) => {
                    VerifyScheduleResponseData(element)
                })
            })
        })

        it('Verify request with correct country code response', () => {
            const countryCode = 'GB'
            cy.request(
                `https://api.tvmaze.com/schedule?country=${countryCode}`
            ).should((response) => {
                expect(response.status).to.eq(200)
                response.body.forEach((element) => {
                    VerifyScheduleResponseData(element, countryCode)
                })
            })
        })

        it('Verify request with correct future date response', () => {
            const futureDate = '2023-08-11'

            cy.request(
                `https://api.tvmaze.com/schedule?date=${futureDate}`
            ).should((response) => {
                expect(response.status).to.eq(200)
                response.body.forEach((element) => {
                    VerifyScheduleResponseData(element, 'US', futureDate)
                })
            })
        })

        it('Verify request with correct past date response', () => {
            const pastDate = '2023-06-11'

            cy.request(
                `https://api.tvmaze.com/schedule?date=${pastDate}`
            ).should((response) => {
                expect(response.status).to.eq(200)
                response.body.forEach((element) => {
                    VerifyScheduleResponseData(element, 'US', pastDate)
                })
            })
        })

        it('Verify request with correct country code and past date response', () => {
            const pastDate = '2023-06-15'
            const countryCode = 'CA'

            cy.request(
                `https://api.tvmaze.com/schedule?country=${countryCode}&date=${pastDate}`
            ).should((response) => {
                expect(response.status).to.eq(200)
                response.body.forEach((element) => {
                    VerifyScheduleResponseData(element, countryCode, pastDate)
                })
            })
        })
    })

    context('Request with wrong parameters', () => {
        it('Verify request with not existing country code response', () => {
            const countryCode = 'XYZ'
            const countryErrorMessage = 'Not a valid ISO country code'

            cy.request(
                {
                    url: `https://api.tvmaze.com/schedule?country=${countryCode}`,
                    failOnStatusCode: false 
                }
            ).should((response) => {
                expect(response.status).to.eq(422)
                expect(response.body.message).to.be.eql(countryErrorMessage)
            })
        })

        it('Verify request with non-ISO country code response', () => {
            const countryCode = 'UK'
            const countryErrorMessage = 'Not a valid ISO country code'

            cy.request(
                {
                    url: `https://api.tvmaze.com/schedule?country=${countryCode}`,
                    failOnStatusCode: false 
                }
            ).should((response) => {
                expect(response.status).to.eq(422)
                expect(response.body.message).to.be.eql(countryErrorMessage)
            })
        })

        it('Verify request with empty country code response', () => {
            const countryCode = ''
            const countryErrorMessage = 'Not a valid ISO country code'

            cy.request(
                {
                    url: `https://api.tvmaze.com/schedule?country=${countryCode}`,
                    failOnStatusCode: false 
                }
            ).should((response) => {
                expect(response.status).to.eq(422)
                expect(response.body.message).to.be.eql(countryErrorMessage)
            })
        })

        it('Verify request with wrong date format response', () => {
            const date = '10-10-2022'
            const dateErrorMessage = 'Not a valid ISO date'

            cy.request(
                {
                    url: `https://api.tvmaze.com/schedule?date=${date}`,
                    failOnStatusCode: false 
                }
            ).should((response) => {
                expect(response.status).to.eq(422)
                expect(response.body.message).to.be.eql(dateErrorMessage)
            })
        })

        it('Verify request with wrong date response', () => {
            const date = '2022-13-13'
            const dateErrorMessage = 'Not a valid ISO date'

            cy.request(
                {
                    url: `https://api.tvmaze.com/schedule?date=${date}`,
                    failOnStatusCode: false 
                }
            ).should((response) => {
                expect(response.status).to.eq(422)
                expect(response.body.message).to.be.eql(dateErrorMessage)
            })
        })

        it('Verify request with null date response', () => {
            const date = null
            const dateErrorMessage = 'Not a valid ISO date'

            cy.request(
                {
                    url: `https://api.tvmaze.com/schedule?date=${date}`,
                    failOnStatusCode: false 
                }
            ).should((response) => {
                expect(response.status).to.eq(422)
                expect(response.body.message).to.be.eql(dateErrorMessage)
            })
        })
    })

    function VerifyScheduleResponseData(element, countryCode = 'US', date = currentDate)
    {
        expect(element.id).not.to.be.null
        expect(element.url).not.to.be.empty
        expect(element.name).not.to.be.empty
        expect(element.airdate).not.to.be.empty
        expect(element.airtime).not.to.be.empty
        expect(element.show).not.to.be.empty

        if(countryCode)
        {
            if(element.show.network)
                expect(element.show.network.country.code).to.be.eql(countryCode)
            else
                expect(element.show.webChannel.country.code).to.be.eql(countryCode)
        }

        if(date)
            expect(element.airdate).to.be.eql(date)

        // add additional checks if necessary
    }
})