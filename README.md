# Business Quant assessment working with the connection of MySQl and Express.js, Node.js
I've done with business_Quant_Assignment which includes the API calls from MySQL database by query the data.I have used to retrieve the data by using NodeJS
**Tech Stack:** -Node.js -Express.js -MySQL Database
**Steps to run the backend:**
Type "npm install",
Type "nodemon db.js", and press enter to run the backend server on Port 3000.

# Instruction
npm install
node app.js
API/Routes

Route to get all company data
localhost:5000/get_all

Route to get revenue and gross profit of a specific company
localhost:5000/get_one_data?ticker=AAPL

Change the ticker value to get specific company
Route to get revenue and gross profit of a specific company for last 5 years

localhost:5000/get_data?ticker=AAPL&column=revenue,gp&period=5y

Change values of ticker and period to get data for required amount of period.
