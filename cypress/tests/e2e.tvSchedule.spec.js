describe('GET /schedule endpoint tests', () => {
    beforeEach(() => {
        cy.visit('/')
    })

    it('Verify TV Schedule page overview', () => {
        cy.get('nav h1')
          .should('be.visible')
        cy.get('input[placeholder="search.."]')
          .should('be.visible')
        cy.get('select[ng-model="perPage"]')
          .should('be.visible')
        cy.get('div[ng-click="sort(\'show.name\')"]')
          .should('have.length', 2)
        cy.get('div[ng-click="sort(\'show.summary\')"]')
          .should('have.length', 2)
        cy.get('div[ng-click="sort(\'airtime\')"]')
          .should('have.length', 2)
        cy.get('div[class="row ng-scope"]')
          .should('have.length', 12)
        cy.get('ul.pagination').should('be.visible')
    })

    it('Verify if correct TV show page can be opened from TV Schedule table', () => {
        cy.get('div[class="row ng-scope"]').eq(0).as('firstRow').find('div.ng-binding').eq(0).invoke('text').then((showName) => {
            cy.get('@firstRow').click()
            cy.get('section.details').find('p.ng-binding').eq(0)
              .should('have.text', ` Name:${showName}`)
        })
        cy.get('button.navBtn')
          .should('be.visible')
        cy.get('p[ng-hide="checkFav(x.id)"]')
          .should('be.visible')
    })

    it('Verify searching on TV Schedule page', () => {
        // filter shows by first show name 
        cy.get('div[class="row ng-scope"]').eq(0).find('div.ng-binding').eq(0).as('firstShowName').invoke('text').then((showName) => {
            cy.get('input[placeholder="search.."]').type(showName)
            cy.get('@firstShowName')
              .should('have.text', showName)
            cy.get('div[ng-click="sort(\'show.name\')"]')
              .should('have.length', 2)
            cy.get('div[ng-click="sort(\'show.summary\')"]')
              .should('have.length', 2)
            cy.get('div[ng-click="sort(\'airtime\')"]')
              .should('have.length', 2)
            cy.get('div[class="row ng-scope"]')
              .should('have.length', 1)
        })
        // clear filter and verify if table has 12 rows
        cy.get('button[ng-click="clearSearch()"]').click()
        cy.get('div[class="row ng-scope"]')
          .should('have.length', 12)
    })

    it('Verify adding show to favorites', () => {
        // add show to favorites
        cy.get('div[class="row ng-scope"]').eq(0).as('firstRow').find('div.ng-binding').eq(0).invoke('text').then((showName) => {
            cy.get('@firstRow').click()
            cy.get('section.details').find('p.ng-binding').eq(0)
              .should('have.text', ` Name:${showName}`)
            cy.get('p[ng-hide="checkFav(x.id)"] i')
              .should('have.text', 'Add to favorites')
            cy.get('img[alt="delete fav"]')
              .should('be.visible')
            cy.get('p[ng-hide="checkFav(x.id)"] img').click()
            cy.get('p[ng-show="checkFav(x.id)"] i')
              .should('have.text', 'Delete from favorites')
            cy.get('img[alt="add to fav"]')
              .should('be.visible')
            // verify if favorite show is listed on main table
            cy.get('button.navBtn').click()
            cy.get('div[ng-show="checkFav(x.id)"]').eq(0).as('favoriteShowRow')
              .should('have.length', 1)
            cy.get('@favoriteShowRow').find('img[alt="add to fav"]')
              .should('be.visible')
            cy.get('@favoriteShowRow').find('div.ng-binding').eq(0)
              .should('have.text', showName)
        })
    })

    it('Verify pagination on TV Schedule page', () => {
        cy.get('div[class="row ng-scope"]')
          .should('have.length', 12)
        cy.get('select[ng-model="perPage"]').eq(0).select('25')
        cy.get('div[class="row ng-scope"]')
          .should('have.length.at.most', 25)
    })
})