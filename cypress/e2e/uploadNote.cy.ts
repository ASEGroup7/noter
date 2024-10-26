import 'cypress-file-upload';

describe('upload note', () => {
    it('goes to upload note link', () => {
      cy.visit('http://localhost:3000/notes/upload')

      cy.get('[aria-label="Rich-Text Editor"]')
      .should('exist')
      .type('This is a test input for cypress');

      cy.get('input[accept="image/*,.jpeg,.jpg,.png,.gif"]')
      .attachFile('../cypress-image.png');

      cy.get('[placeholder="Write a title ..."]')
      .should('exist')
      .type('Cypress Testing Title');

      cy.contains('Upload').click();

      // added delay time for uploading new note
      cy.wait(10000);
    })

    it('goes to notes page', () => {
      cy.wait(5000);
      cy.visit('http://localhost:3000/notes')

      cy.contains('Cypress Testing Title')
      .should('be.visible');
    })
  })
  