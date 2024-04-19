// "node_modules/(?!axios)"
import React from 'react';

describe('Admin happyPath Workflow', () => {
    it('Completes the happyPath workflow successfully', () => {
      // Step 1: Admin registers successfully
      cy.visit('/register');
      cy.get('input[name="email"]').type('test_user');
      cy.get('input[name="password"]').type('22222223');
      cy.get('input[name="confirmPassword"]').type('22222223');
      cy.get('input[name="name"]').type('user');
      cy.get('button[type="submit"]').click();
  
      // Step 2: Admin creates a new presentation
      cy.url().should('include', '/dashboard');  // Confirms that the URL is correct
      cy.contains('Dashboard').should('be.visible');  // Verifies that dashboard text is visible
      cy.get('button:contains("New Presentation")').click();
      cy.get('input[name="name"]').type('Admin Presentation');
      cy.get('button[type="submit"]').contains('Create').click();
  
      // Step 3: Admin updates the thumbnail and name of the presentation
      cy.contains('Admin Presentation').click();
      cy.url().should('include', '/edit-presentation');  // Confirms that the URL is correct
      cy.get('[data-cy="edit-icon-button"]').click();
      cy.get('[data-cy="modal-element"]').should('be.visible');
      cy.get('[data-cy="modal-title-input"]').clear().type('Updated Presentation Title');
      cy.get('[data-cy="modal-thumbnail-input"]').clear().type('https://updatedthumbnail.com/image.jpg');
      cy.get('[data-cy="modal-save-btn"]').click();
      cy.contains('Updated Presentation Title').should('exist');
      // cy.get('img[src="https://example.com/new-thumbnail.jpg"]').should('be.visible');   
  
      // Step 5: Admin adds some slides in a slideshow deck
      cy.get('[data-cy="add-new-slide-button"]').click(); 
  
      // Step 6: Admin switches between slides
      cy.get('[data-cy="next-slide-button"]').click();  // Adjust if using different data-cy attributes
      cy.contains('Slide 2').should('be.visible'); 
      cy.get('[data-cy="previous-slide-button"]').click();
      cy.contains('Slide 1').should('be.visible'); 

      // Step 4: Admin deletes a presentation
      cy.get('[data-cy="delete-presentation-button"]').click(); 
      cy.get('[data-cy="confirm-delete-button"]').click();
      cy.url().should('include', '/dashboard'); 
  
      // // Step 7: Admin logs out of the application
      cy.wait(1000);
      cy.contains('button', 'Logout').click();
      cy.url().should('include', '/login');

      // Step 8: Admin logs back into the application
      // cy.visit('/login');
      cy.get('input[name="email"]').type('test_user');
      cy.get('input[name="password"]').type('22222223');
      cy.get('[data-cy="login-button"]').click();
      cy.contains('button', 'Logout').should('be.visible'); 
    });
  });