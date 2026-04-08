describe('Multi-Tenancy & Subscription Restrictions', () => {
  it('Should log into Alpha Corp (Basic Plan) and NOT see CRM or POS', () => {
    cy.visit('/login')
    cy.get('input[name="email"]').type('admin@alphacorp.com')
    cy.get('input[name="password"]').type('12345678')
    cy.get('button[type="submit"]').click()

    // Assuming we redirect to dashboard
    cy.url().should('include', '/dashboard')
    
    // Check Sidebar for absence of premium features
    cy.contains('Mission Command').should('not.exist')
    cy.contains('CRM').should('not.exist')
    cy.contains('POS').should('not.exist')

    // Accessing directly should throw an error or redirect
    cy.visit('/crm/dashboard')
    cy.contains('403').should('exist').or( cy.url().should('include', '/dashboard') )
  })

  it('Should log into Noble (Professional Plan) and SEE everything', () => {
    cy.visit('/login')
    cy.get('input[name="email"]').type('admin@noble.com')
    cy.get('input[name="password"]').type('12345678')
    cy.get('button[type="submit"]').click()

    cy.url().should('include', '/dashboard')
    cy.contains('CRM').should('exist')
    cy.contains('POS').should('exist')
  })
})
