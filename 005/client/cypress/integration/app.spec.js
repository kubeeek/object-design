/// <reference types="cypress" />
import { makeAnOrder } from "../helpers"

const server = "http://localhost:3001";

async function clearServerEndpoint(endpoint) {
    let result = await fetch(server + endpoint)
    let data = await result.json()

    if("error" in data)
        throw new Error(data.error.code)

    for(const element of data) {
        const id = "id" in element ? element.id : element.uuid;
        await fetch(server + endpoint + "/" + id, { method: "DELETE"});
    }
}

async function clearServerServices() {
    return clearServerEndpoint("/services")
}

async function clearServerOrders() {
    try {
        await clearServerEndpoint("/orders")

    } catch (err) {
        cy.log(err)
        
    }

    return
}   


async function seedServices() {
    const seeds = [{name: "Service 1", price: 1500}, {name: "Service 2", price: 100}, {name: "Service 3", price: 21551}]

    for(const { name, price } of seeds) {
        await fetch(server + "/services",
        {
            headers: {
                'Content-type': 'application/json; charset=UTF-8'
            },
            method: "POST",
            body: JSON.stringify({ name, price })
        })
    }
}

describe('Home page', () => {
    before(async () => {
        await clearServerServices();
    });

    it('has route working', () =>{
        cy.visit('/')

        cy.contains('Available services')
    })

    it('has navigation working', () =>{
        cy.get('nav > ul').contains('Home').click()

        cy.contains('Available services')
    })

    it('has 404 route working', () =>{
        cy.visit('/dsadsad')

        cy.contains('404')
    })

    context('with no services in a database', () => {
        it('shows information that no services are available', () => {
            cy.visit('/')
    
            cy.contains('No services')
        })
    });

    context('with services in a database', () => {
        before(async () => {
            await seedServices()
        })

        it('shows available products', () => {
            cy.visit('/')
            cy.get('table').get('tbody').should('contain', 'Service 1').and('contain', '$215.51')
            cy.get('table').get('tbody').should('contain', 'Service 2').and('contain', '$1')
            cy.get('table').get('tbody').should('contain', 'Service 3').and('contain', '$15')
            cy.get('table').get('tbody').find('tr').should('have.length', 3)

        })
    
        it('can add products to the cart', () => {
            cy.visit('/')

            cy.get('table').get('tbody').children().first().children().last().children().click()
            cy.get('table').get('tbody').children().last().children().last().children().click()

            cy.get('nav').contains("2")

        })
    });
})

describe("Cart page", () => {
    before(async () => {
        await clearServerServices()
        await seedServices()

    });

    it('has route working', () =>{
        cy.visit('/cart')

        cy.contains('Your cart')
    })

    it('has navigation working', () =>{
        cy.get('nav > ul').children().last().click()

        cy.contains('Your cart')
    })

    context('when cart is empty', () => {
        it('shows info about empty cart', () =>{
            cy.get('nav > ul').children().last().click()
    
            cy.contains('Your cart')
            cy.contains('There is nothing in your cart at the moment')
        })
    });

    context('when cart is not empty', () => {
        beforeEach(() => {
            cy.visit('/')
            
            cy.get('table').get('tbody').children().first().children().last().children().click()
            cy.get('table').get('tbody').children().last().children().last().children().click()
        });

        after(async () => {
            await clearServerOrders()
        })

        it('shows summary about the cart', () =>{
            cy.get('nav > ul').children().last().click()
    
            cy.contains('Your cart')
            cy.contains('Total products: 2')
            cy.contains('Total cost: $230.51')
            cy.get('button').contains('Place an order')
        })

        it('can remove products from the cart', () =>{
            cy.get('nav > ul').children().last().click()
            
            cy.get('table').get('tbody > tr').children().last().click()

            cy.contains('Total products: 1')
            cy.contains('Total cost: $1')
            cy.get('button').contains('Place an order')
        })

        it('can make an order', () =>{
            cy.get('nav > ul').children().last().click()
            
            cy.get('button').contains('Place an order').click()

            cy.url().should('contain', '/orders')
        })
    });
});

describe("Orders page", () => {
    it('has route working', () =>{
        cy.visit('/orders')

        cy.contains('Your orders')
    })

    it('has navigation working', () =>{
        cy.get('nav > ul').contains('Orders').click()

        cy.contains('Your orders')
    })

    context('with no orders in a database', () => {
        it('shows empty table', () =>{
            cy.get('nav > ul').contains('Orders').click()
    
            cy.get('table').get('tbody').children().should('have.length', 0)
        })
    })

    context('with orders in a database', () => {
        before(async () => {
            await clearServerServices()
            await seedServices()
        })

        before(() => {
            makeAnOrder()
        })

        after(async () => {
            await clearServerOrders()
        })


        it('shows table with orders', () =>{
            cy.get('nav > ul').contains('Orders').click()
    
            cy.get('table').get('tbody').children().should('have.length', 1)
            cy.get('table').get('tbody').children().find('button').contains('Pay')
            cy.get('table').get('tbody').children().contains('$230.51')

        })

        it('can pay the order', () =>{
            cy.get('nav > ul').contains('Orders').click()
    
            cy.get('table').get('tbody').children().find('button').contains('Pay').click()
            cy.get('table').get('tbody').children().find('svg')

        })
    })
});

describe("Contact page", () => {
    it('has route working', () =>{
        cy.visit('/contact')

        cy.contains('Contact form')
    })

    it('has navigation working', () =>{
        cy.get('nav > ul').contains('Contact').click()

        cy.contains('Contact form')
    })

    it('shows a form', () =>{
        cy.get('nav > ul').contains('Contact').click()

        cy.get('form').should('be.visible')
        cy.get('form').find('input').should('have.length', 2)
        cy.get('form').find('button').contains('Submit')
    })

    it('can send a valid form', () =>{
        cy.get('nav > ul').contains('Contact').click()

        cy.get('[name="topic"]').type('Lorem ipsum')
        cy.get('[name="email"]').type('lorem@ipsum.pl')
        cy.get('[name="text"]').type("Lorem irem sjadha kdsa")
        cy.get('form').find('button').click()
    })

    it('shows errors at no valid form', () =>{
        cy.get('nav > ul').contains('Contact').click()

        cy.get('[name="topic"]').type('')
        cy.get('[name="email"]').type('loremipsum.pl')
        cy.get('[name="text"]').type("")
        cy.get('form').find('button').click()
    })
});