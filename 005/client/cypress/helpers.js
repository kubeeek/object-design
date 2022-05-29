export function makeAnOrder() {
    cy.visit('/')
    cy.get('table').get('tbody').children().first().children().last().children().click()
    cy.get('table').get('tbody').children().last().children().last().children().click()

    cy.get('nav > ul').children().last().click()
    
    cy.get('button').contains('Place an order').click()
} 