const express = require('express');
const cors = require('cors');

const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  const { username } = request.headers;

  const user = users.find((user) => user.username === username);
  console.log(user);

  if (!user) {
    return response.status(400).json({ error: "User not in DataBase." });
  }

  request.user = user;

  return next();
}

app.post('/users', (request, response) => {

  const { name, username } = request.body;

  const userAlreadyExists = users.some(
    (username) => users.username === username
  );

  if (userAlreadyExists) {
    return response.status(400).json({ error: "Username Already Exists." });
  }

  users.push({
    id: uuidv4,
    name,
    username,
    todos: []
  });

  return response.status(201).send();
});

app.get('/todos', checksExistsUserAccount, (request, response) => {

  const { user } = request;

  return response.json(user.todos);
});

app.post('/todos', checksExistsUserAccount, (request, response) => {

});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
});

module.exports = app;
