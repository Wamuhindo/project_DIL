# Project DIL Politecnico Group 8
The application consists of a login screen, that lead you to the home screen when you have to choose the channel button! Then you go to the channel list on which the user is subscribed!! When he chooses one channel, he goes to the channel page when he can see what others has posted. He can make new post or comment out on an existing one!
While doing a comment a user, if he is a doctor, a chat button will be displayed on the channel for another user subscribed to the channel.
We used to react native for the front-end of the app, we also implemented an application server with nodejs. That application server is connected to the remote mongoDB database!!

For the real-time messages, we used socket, to have the change to appear to the screens of other users without the need to refresh the app! So once a post is done on a channel, it is automatically visible to other users.

We used preregistered users:
Name: abednego, Password : abednego : he is a doctor, so the chat button will appear on his comments
Name: irfan, Password: irfan : he is a usual user
Name: vinay, Password: vinay : he is a usual user
Name: Dr.Angelos, Password: angelos : he is a doctor, so the chat button will appear on his comments
Please respect case when connecting otherwise you will not have the access allowed!!
The server is hosted online.
