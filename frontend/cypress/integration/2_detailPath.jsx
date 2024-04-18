// "node_modules/(?!axios)"
import React from 'react';

describe('Admin detailPath Workflow', () => {
    it('Completes the Detailed Path workflow successfully', () => {
      // Step 1: Admin loginss successfully, enter the presentation page, see slide1 in the page
      cy.visit('/login');
      cy.get('input[name="email"]').type('admin');
      cy.get('input[name="password"]').type('22222223');
      cy.get('button[type="submit"]').click();
      cy.url().should('include', '/dashboard'); 
      cy.get('button:contains("New Presentation")').click();
      cy.get('input[name="name"]').type('Admin Presentation');
      cy.get('button[type="submit"]').contains('Create').click();
      cy.contains('Admin Presentation').click();
      cy.contains('Slide 1').should('be.visible'); 

      // Step 2: add an element to the slide1
      cy.get('[data-cy="edit-slide"]').eq(0).click();
      cy.get('[data-cy="edit-slide-text-size"]').type('50');
      cy.get('[data-cy="edit-slide-text-text"]').type('111 New Element for Slide 1');
      cy.get('[data-cy="edit-slide-text-fontsize"]').type('5');
      cy.contains('button', 'Create').click({ force: true });
      cy.contains('New Element for Slide 1').should('be.visible');

      // Step 3: Adds slides in the slideshow deck and an element on slide
      cy.get('[data-cy="add-new-slide-button"]').click();
      cy.get('[data-cy="next-slide-button"]').click();  // Adjust if using different data-cy attributes
      cy.contains('Slide 2').should('be.visible'); 
      cy.get('[data-cy="edit-slide"]').eq(0).click();
      cy.get('[data-cy="edit-slide-text-size"]').type('50');
      cy.get('[data-cy="edit-slide-text-text"]').type('222 New Element for Slide 2');
      cy.get('[data-cy="edit-slide-text-fontsize"]').type('5');
      cy.contains('button', 'Create').click({ force: true });
      cy.contains('222 New Element for Slide 2').should('be.visible');

      // Step 4: Switches between slides
      cy.get('[data-cy="previous-slide-button"]').click();
      cy.contains('Slide 1').should('be.visible');
      cy.get('[data-cy="next-slide-button"]').click();
      cy.contains('Slide 2').should('be.visible');
    }); 

    // it('Step 4: Switches between slides', () => {
    //   cy.get('[data-cy="next-slide-button"]').click();
    //   cy.contains('Slide 2').should('be.visible');
    //   cy.get('[data-cy="previous-slide-button"]').click();
    //   cy.contains('Slide 1').should('be.visible');
    // });

    // it('Step 5: Enters the preview page, starting from slide 1', () => {
    //   cy.get('[data-cy="preview-presentation-button"]').click();
    //   cy.contains('Slide 1').should('be.visible');
    // });

    // it('Step 6: Switches between slides in preview presentation', () => {
    //   cy.get('[data-cy="next-slide-button"]').click();
    //   cy.contains('Slide 2').should('be.visible');
    // });

    // it('Step 7: Returns to Edit Presentation page and enters reorder page', () => {
    //   cy.get('[data-cy="exit-preview-button"]').click();
    //   cy.get('[data-cy="reorder-slides-button"]').click();
    // });

    // it('Step 8: Reverses the order of slides and checks updated order', () => {
    //   cy.get('[data-cy="slide-reorder-handle-1"]').drag('[data-cy="slide-reorder-target-2"]');
    //   cy.get('[data-cy="save-reorder-button"]').click();
    //   cy.contains('Slide 1').should('be.visible'); // Assuming the UI updates to reflect the reorder immediately
    // });
  
    // it('Step 9: Checks current slide after reordering', () => {
    //   cy.contains('Slide 2').should('be.visible');
    // });

    // it('Step 10: Deletes a slide, ensuring only one slide remains', () => {
    //   cy.get('[data-cy="delete-slide-button"]').click();
    //   cy.get('[data-cy="confirm-delete-slide-button"]').click();
    //   cy.contains('Slide 1').should('be.visible');
    //   cy.get('[data-cy="slide-2"]').should('not.exist');
    // });

    // it('step 11: Admin deletes a presentation and logs out of the application', () => {
    //   cy.get('[data-cy="delete-presentation-button"]').click(); 
    //   cy.get('[data-cy="confirm-delete-button"]').click();
    //   cy.url().should('include', '/dashboard');
    //   cy.contains('button', 'Logout').click();
    //   cy.url().should('include', '/login'); 
    // });
  });