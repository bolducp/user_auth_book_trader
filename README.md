# user_auth_book_trader
a user-authenticated Node.js app for trading books, made using Express.js, MongoDb, and Firebase

### Created in collaboration with [Jeff Tabachnick] (https://github.com/jtabach)

#### Deployed on Heroku: https://damp-mesa-10125.herokuapp.com/

### Functionality
* Register a new account, login into account, stay logged in during a single browsing session, change or reset password (user authentication managed through Firebase)
* Add books to user account and manage their availabity for trade
* View other users' available books and offer book trades
* Sort and filter search books in the user's book list and others' available book list
* Accept or decline offered trades
* Cancel previously offered trades
* View all pending trade transactions (sent and received) and all past transactions
* If a book is traded while involved in other pending transactions, all other transactions involving that book will immediately expire and be logged in the transaction history

#### Future functionality:
Use an API to fetch the cover images of books automatically by their ISBN number



