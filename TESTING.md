 Detailed Path: 
 
 Step 1: Admin loginss successfully, enter the presentation page, see slide1 in the page
 Step 2: add an element to the slide1
 Step 3: Admin adds some slides in a slideshow deck, and add element on slide 
 step 4: Admin switches between slide
 step 5: entet the preview page, from slide 1 statu
 step 6: Admin switches between slides in preview presenttation statu
 step 7: back to Edit Presentation page, and enter reorder pag
 step 8: there has slide 1 and slide 2 two slides, reverse the order of slide 1 and slides , then back to edit page. (tried to use '@4tw/cypress-drag-drop' for operating the drag action, but another slide cannot be found if drag action started. There indeed has two slides, so this step is not fully completed.)
 step 9: current slide is slide 
 step 10: Admin delete a slide, so only slide 1 on the page no
 step 11: Admin deletes a presentation and logs out of the application

 Additional: 
 1. For component and UI testing, just type 'npm run test', it will run all the component tests(Using Jest) and UI test(using cypress) at one time( the script in Package.json has been modified).
 2. there are overall seven component test(except App.test.jsx) using Jest.
 3. Please run it after reset the backend datebase.