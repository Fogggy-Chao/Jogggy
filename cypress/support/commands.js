Cypress.Commands.add('waitForBackend', () => {
  cy.request({
    url: 'http://localhost:8000/api/health',
    retryOnStatusCodeFailure: true,
    timeout: 30000,
  }).then((response) => {
    expect(response.status).to.eq(200);
  });
}); 