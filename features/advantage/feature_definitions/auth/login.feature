Feature: Authentication Flows Test

    As a user on Advantage,
    I should be able to login to the site.

    Background:
        Given I am on the Advantage login page
        When I click the "Log In" button

    Scenario: Successful login
        And I enter "correct" login credentials and submit
        Then I should see the Advantage home page

    Scenario: Failed login
        And I enter "wrong" login credentials and submit
        Then I should see a login failure error
