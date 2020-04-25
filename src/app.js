const express = require("express");
const cors = require("cors");

const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function validateRepositoryID(request, response, next) {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(
    (repository) => repository.id === id
  );

  if (!isUuid(id) || repositoryIndex < 0) {
    return response.status(400).json({ error: "Invalid repository ID." });
  }

  response.locals.repositoryIndex = repositoryIndex;

  return next();
}

app.use("/repositories/:id", validateRepositoryID);
app.use("/repositories/:id/like", validateRepositoryID);

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;
  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0,
  };

  repositories.push(repository);
  return response.json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const { repositoryIndex } = response.locals;
  const { title, url, techs } = request.body;

  if (title) {
    repositories[repositoryIndex].title = title;
  }

  if (url) {
    repositories[repositoryIndex].url = url;
  }
  if (techs) {
    repositories[repositoryIndex].techs = techs;
  }

  return response.json(repositories[repositoryIndex]);
});

app.delete("/repositories/:id", (request, response) => {
  const { repositoryIndex } = response.locals;

  repositories.splice(repositoryIndex, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { repositoryIndex } = response.locals;

  repositories[repositoryIndex].likes++;

  return response.json(repositories[repositoryIndex]);
});

module.exports = app;
