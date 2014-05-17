#tictactoe
A web application that uses JQuery, websockets and node.js to handle simultaneous inputs from several users. A player can drag elements of the tic-tic-toe board across the screen and the movement will appear on the screens of other players instantly. 

###Features
* Receives and broadcasts simultaneous inputs from multiple users
* Create a new world, or join an existing one, for users to play with friends

###Running the application:
* Install node.js on a server
* Select port by changing the files config.js and config_node.js
* Edit index.html to point the websocket towards your server
* Start the server "tictactoe-server.js"
* Open browser to index.html
* Have a friend join you in the game!