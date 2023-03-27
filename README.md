<h3>RESUME</h3>
This is the backend code repository of Lingua chat, a message chat aplication that auto translate the messages from sender language to receivor language.

In this document i gonna talk about what technologies i have used for it and the architecture of the project.
In the frontend side i make use of React wich repository of the project is: https://github.com/jazdevv/message-translate-app-frontend-react

Every time i develop a project i like to develop something innovator and that can help the people in one way or another, and this is one of the apps that do it. Lot of people want to comunicate with other people that speak different language and at the end they usually end up using a translator tool like google translator to do it, doing that they lose time and dont have the same ilusion to speak with other people due the time they spend translating.
Is with this app that the problem gets solved, every message its translated with google API before reach the client device if user have that option activated, so the users directly read the translated messages making them feel like they speaking to someone that speak his language.

<h3>TECNHNOLOGIES USED</h3>
In backend side i have used Node.js with typescript using his popular framework Nest.js.
I developed the backend thinking in scalability and security of the aplication, i think that dont matter if its a personal project like this or if its a project for someone else like a company, you always should writte good code.

Getting inside wich technlogies do i use for this project i choose Nest js instead of express mainly because i like to use it due to its rigid and solid OOP structure and pre-build components that makes the development faster.
Nest combines perfectly with typeORM so i use it toghether with Postgree database hosted on AWS rds as database infrastructure.
AWS S3 is used for image hosting of the images of the application, and each object url is saved on the database.
Authentication uses jwt cookies system, validated in each request.
For connection between react and node is used http and websockets(socketio) for real time comunication.

<h3>ARCHITECTURE</h3>

Database diagram:
<img src='/DATABASE-DIAGRAM.PNG'>


Explanation: Messages are organized and sended with a conversation id. That conversation id is a database row with data like unique id , wich users are in and less important data. Each time a user want to acces to wich messages have sended or received with other user it does with the conversation id. The conversations id is a critical part of the aplication, malicious people have acces to ton of critical and confidential data it its not protected, and its so that validation is executed every time a user wants to interact with each conversation id.

The translation of the messages is done every time user asks for messages, where that messages are fetched from the database and passed to a translation function with the user profile data. 
That function is responsable to check if the user want his messages gets translated to his election language, and if he wants, an https request is send to google translator api with the messages that want to translate. Once the response is received the translated messages are sended to the user instead of the untranslated ones.

