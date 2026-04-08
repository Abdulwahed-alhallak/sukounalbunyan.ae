describe('Core Authentication', () => {
  it('Should successfully login Super Admin and redirect to dashboard', () => {
    // Navigate to Login Page
    cy.visit('/login')

    // Ensure we are on login map
    cy.get('input[name="email"]').should('be.visible')
    cy.get('input[name="password"]').should('be.visible')

    // Submit Credentials
    cy.get('input[name="email"]').type('superadmin@dion.sy')
    cy.get('input[name="password"]').type('1234')
    cy.get('button[type="submit"]').click()

    // Assuming we redirect to dashboard
    cy.url().should('include', '/dashboard')
    cy.contains('Mission Command').should('exist') // Confirm Dynamic Menu loads
  })

  it('Should throw error for bad credentials', () => {
    cy.visit('/login')
    cy.get('input[name="email"]').type('bad@credentials.com')
    cy.get('input[name="password"]').type('wrongpass')
    cy.get('button[type="submit"]').click()

    cy.contains('These credentials do not match our records.').should('be.visible')
  })
})
