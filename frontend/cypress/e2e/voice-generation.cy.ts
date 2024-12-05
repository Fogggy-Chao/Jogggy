describe('Voice Generation', () => {
  beforeEach(() => {
    cy.waitForBackend();
    cy.waitForFrontend();
    
    cy.visit('/', {
      timeout: 30000,
      failOnStatusCode: true,
      retryOnStatusCodeFailure: true
    });
  });

  it('should show voice generation interface', () => {
    cy.get('[data-testid="file-upload"]', { timeout: 10000 }).should('exist');
    cy.get('[data-testid="script-input"]', { timeout: 10000 }).should('exist');
  });
}); 