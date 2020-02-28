describe('Real Estate App E2E testing ', () => {
  // eslint-disable-next-line no-undef
  before(() => {
    // Clear out db before starting E2E tests
    cy.request('DELETE', 'http://localhost:4000/testing/reset');
    Cypress.Cookies.preserveOnce('jwtToken', 'email', 'role', 'id');
  });

  beforeEach(() => {
    Cypress.Cookies.preserveOnce('jwtToken', 'email', 'role', 'id');
  });

  it('Home page can be opened', () => {
    cy.visit('http://localhost:3000/logout');
    cy.contains('Home');
  });

  it('Sign Up page can be opened via clicking from menu', () => {
    cy.get('a').contains('Register now!').click();
  });

  it('SignUp page can be opened', () => {
    cy.visit('http://localhost:3000/sign-up');
    cy.contains('Sign Up');
    cy.get('input[id=normal_signup_email]').type('irakli@test.com');
    cy.get('input[id=normal_signup_password]').type('12345678');
    cy.get('input[id=normal_signup_confirmPassword]').type('12345678');
    cy.get('input[id=normal_signup_name]').type('Irakli Test Name');
    cy.get('button[type=submit]').click();
    cy.contains('Apartments');
  });

  it('Edit profile page can be opened', () => {
    cy.get('li').contains('Profile').click();
  });

  it('Name can be changed and successfully updated', () => {
    cy.get('input[id=editProfile_name]').type(' is now appended with this!');
    cy.get('button[type=submit]').click();
  });
  it('Logouts user succesfully', () => {
    cy.get('li').contains('Logout').click();
  });
  it('Now we are seeing Login Screen, lets log in as a realtor', () => {
    cy.contains('Log In').click();
    cy.get('input[id=normal_login_email]').type('good@realtor.com');
    cy.get('input[id=normal_login_password]').type('12345678');
    cy.get('button[type=submit]').click();
  });
  it('Logs in realtor, add new apartment', () => {
    cy.contains('Owned Apartments');
    cy.get('li').contains('Add Apartment').click();
    cy.get('input[id=apartmentForm_name]').type('Sunny shine');
    cy.get('input[id=apartmentForm_floorAreaSize]').type(200);
    cy.get('input[id=apartmentForm_numberOfRooms]').type(6);
    cy.get('input[id=apartmentForm_pricePerMonth]').type(3500);
    cy.get('input[id=apartmentForm_description]').type('A very good place to live in');
    cy.get('button[id=apartmentForm_isAvailable]').click();
    cy.get('input[id=apartmentForm_loc]').type('41,45');
    cy.get('button[type=submit]').click();
  });
  it('Shows list of apartments', () => {
    cy.contains('Sunny shine');
    cy.contains('Edit').click();
    cy.get('input[id=apartmentForm_name]').type(' 2');
    cy.get('button[type=submit]').click();
    cy.contains('Sunny shine 2');
    cy.get('li').contains('Logout').click();
  });
  it('Now we are seeing Login Screen, lets log in as a client', () => {
    cy.contains('Log In').click();
    cy.get('input[id=normal_login_email]').type('irakli@test.com');
    cy.get('input[id=normal_login_password]').type('12345678');
    cy.get('button[type=submit]').click();
    cy.contains('Apartments');
  });

  it('Now we should book an apartment as a client', () => {
    cy.contains('Sunny shine 2');
    cy.contains('Book Now').click();
    cy.contains('Bookings').click();
    cy.contains('Sunny shine 2');
  });

  it('Now we should unbook an apartment as a client', () => {
    cy.contains('Unbook').click();
    cy.contains('Apartments').click();
    cy.contains('Sunny shine 2');
    cy.get('li').contains('Logout').click();
  });

  it('Now we should log in as admin', () => {
    cy.contains('Log In').click();
    cy.get('input[id=normal_login_email]').type('good@admin.com');
    cy.get('input[id=normal_login_password]').type('12345678');
    cy.get('button[type=submit]').click();
    cy.contains('Users');
  });

  it('Lets add new user with admin', () => {
    cy.contains('Add User').click();
    cy.get('input[id=admin_user_edit_email]').type('good@client.com');
    cy.get('input[id=admin_user_edit_name]').type('Good clients name here');
    cy.get('button[type=submit]').click();
  });

  it('Lets delete apartment of realtor with admin', () => {
    cy.contains('good@client.com');
    cy.contains('good@realtor.com').click();
    cy.contains('Sunny shine 2');
    cy.contains('Edit').click();
    cy.contains('Delete').click();
    cy.contains('Yes').click();
  });
  it('Log out admin, all tests passed', () => {
    cy.get('li').contains('Logout').click();
  });
});
