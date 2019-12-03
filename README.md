# Innovaccer-Assignment



**The Application consists of 4 pages-**

`checkin` - check-in page (for users)

`host_register` - for registration of host. only a single host can register, there can't be multiple numbers of hosts.

`host_login` - login page (for host only)

`users` - 

 - contains table which shows all the checked-in users.
 - only host can access this page by logging into his account.
 - host can't access this page without login.
 - host can check-out a user(checked-in user) from this page.
 - host can also log out (from this page).
<br><br><br>
 - when a user checks in, a mail is sent to the registered host, entry of
   this user can be seen in the table of users page (only host can see it).
 - when a user checks out, a mail is sent to the user itself and that user's
   entry is deleted from the table (on users page).
<br><br><br>
 - `index.js` is the file that contains all the routes of application.
 - to send emails to the host and user (when a user checks-in and
   checks-out), you will have to put your email address and password at some places in `index.js` (see attached pictures in repository) and turn on the access for less secure apps (when you are checking the functioning of application).
 - you will have to use your Gmail account to check the functioning of application.



