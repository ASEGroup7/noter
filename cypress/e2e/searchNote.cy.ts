describe('search note', () => {
    it('search for note starting with "Cypress"', () => {
      cy.visit('http://localhost:3000/notes')

      cy.get('.lucide.lucide-search').click();

      cy.get('[placeholder="Search ..."]')
      .should('exist')
      .type('Cypress ');

      cy.get('[aria-label="Suggestions"]').within(() => {
        cy.contains('Cypress Testing Title').should('be.visible');
      });  
    })

    it('search for note starting with "Classic"', () => {
        cy.visit('http://localhost:3000/notes')
  
        cy.get('.lucide.lucide-search').click();
  
        cy.get('[placeholder="Search ..."]')
        .should('exist')
        .type('Classic ');
  
        cy.get('[aria-label="Suggestions"]').within(() => {
          cy.contains('Classic Mistakes and Ethics').should('be.visible');
        });  
    })

    it('different notes starting with letter "C" show up', () => {
        cy.visit('http://localhost:3000/notes')
  
        cy.get('.lucide.lucide-search').click();
  
        cy.get('[placeholder="Search ..."]')
        .should('exist')
        .type('C ');
  
        cy.get('[aria-label="Suggestions"]').within(() => {
            cy.contains('Cypress Testing Title').should('be.visible');
        });  
        
        cy.get('[aria-label="Suggestions"]').within(() => {
          cy.contains('Classic Mistakes and Ethics').should('be.visible');
        });
    })
})