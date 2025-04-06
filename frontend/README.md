# Project

## Installation

```sh
git clone <repository URL>
npm install
npm install --legacy-peer-deps
npm run dev
Technologies
React

Next

Axios

TypeScript

TanStack Query

Tailwind CSS

Shad/cn UI

FramerMotion

...

Contact
pvs.versia@gmail.com

Description
When the project starts, if the user is not logged in, he will be shown a redirection link, or be redirected to the authentication page. All site resources that require data loading using accessToken will be closed for access until authentication through the Login form. The last authenticated user's name will be displayed in the upper right corner of the site in the menu block and highlighted with a red background in the badge. Upon receiving the token pair, the menu items requiring authentication will be unlocked. When making requests to an external API, the tokens used are pulled from session.

Functionality
Redirect to authentication page: If the user is not logged in, they will be automatically redirected to the authentication page.

Access to resources: All site resources that require accessToken will be inaccessible until successful authentication.

User display: The logged-in user will be displayed in the upper right corner of the site in the menu block and highlighted with a red background in the badge.

Unlocking menu items: Upon receiving the token pair, the menu items requiring authentication will be unlocked.

Using tokens: When making requests to an external API, the tokens used are pulled from session.

Repeated authentication: A repeated authentication error leads to the cycle stopping and signals the need to go through the authentication procedure again, starting with Login.

Working with Filters
To work with filters in the project, follow these steps:

Define filters: Filters are defined in the corresponding components and can be used to filter data based on various criteria.

User Interface for Filters: The user interface includes a "Filters" button that opens a form for entering corresponding text values, which serve as templates for searching in the relevant fields of the entire list of objects. To remove the filter, reopen the form without entering any values.

Infinite Scroll
Infinite Scroll: The project includes an infinite scroll feature. To apply it, you simply move your scroll downward.