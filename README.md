# entryMangement
Entry Management Software for any office built using NodeJs

database entrydocument model : is to save the data of guest's who havent checked out yet.

database dataEntry model : is to save data for future reference if needed.

INDEX page

The guest enters his name, email, office address and phone numberas well as host's name, email and phone number on index.html page.
Then a post request is made to server from index.html to check if the data provided is in specified format and the to save the data with a checkin time in database model entrydocument

CHECKOUT page

When guest check's out of the office he agains enters his information (name, email, phone no) on the checkout page.
Then a post request is made to server from checkout.hbs to check if the data provided is present in the database model entrydocument.
If present then removes this document from database entrydocument model and saves the complete details of guest's visit in database dataEntry model for future refrence and sends guest an email and sms providing him the details of his visit (his name,his email, his phone number,his checkin time, his checkout time,office address visited,host's name, host's email, host's phone number).

INDEX page image
https://github.com/dhruv1701/entryMangement/blob/master/index.JPG

CHECKOUT page image
https://github.com/dhruv1701/entryMangement/blob/master/checkout.JPG
