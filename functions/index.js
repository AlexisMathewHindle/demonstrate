const functions = require("firebase-functions");

const cors = require("cors")({ origin: true });
const axios = require("axios");
const fs = require("fs");
const path = require("path");

const markdownDir = path.join(__dirname, "markdown");

exports.listMarkdownFiles = functions.https.onRequest((req, res) => {
  console.log(markdownDir, "===== mark down dir");
  fs.readdir(markdownDir, (err, files) => {
    if (err) {
      return res.status(500).send("Unable to scan files");
    }
    const markdownFiles = files.filter((file) => file.endsWith(".md"));
    res.json(markdownFiles);
  });
});

exports.getMarkdownFile = functions.https.onRequest((req, res) => {
  const fileName = req.query.file;
  if (!fileName) {
    return res.status(400).send("File name is required");
  }
  const filePath = path.join(markdownDir, fileName);
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      return res.status(500).send("Unable to read file");
    }
    res.send(data);
  });
});

exports.createBranchAndPR = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    res.set("Access-Control-Allow-Origin", "*");
    res.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.set("Access-Control-Allow-Headers", "Content-Type, Authorization");

    if (req.method === "OPTIONS") {
      res.status(204).send("");
      return;
    }

    const { token, repo, branchName, content, type, title, body } =
      req.body.data;
    const baseUrl = `https://api.github.com/repos/${repo}`;

    const headers = {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github.v3+json",
    };

    try {
      // Check if the token is valid
      await axios.get("https://api.github.com/user", { headers });

      const defaultBranchInfo = await axios.get(`${baseUrl}/branches/main`, {
        headers,
      });
      const sha = defaultBranchInfo.data.commit.sha;

      await axios.post(
        `${baseUrl}/git/refs`,
        {
          ref: `refs/heads/${branchName}`,
          sha: sha,
        },
        { headers }
      );

      const path = type === "story" ? "stories" : "guides";
      await axios.put(
        `${baseUrl}/contents/functions/markdown/${path}/${branchName}.md`,
        {
          message: `Add new ${type}`,
          content: Buffer.from(content).toString("base64"),
          branch: branchName,
        },
        { headers }
      );
      await axios.put(
        `${baseUrl}/contents/src/assets/markdown/${path}/${branchName}.md`,
        {
          message: `Add new ${type}`,
          content: Buffer.from(content).toString("base64"),
          branch: branchName,
        },
        { headers }
      );

      const pullRequestResponse = await axios.post(
        `${baseUrl}/pulls`,
        {
          title: title,
          body: body,
          head: branchName,
          base: "main",
        },
        { headers }
      );

      res.status(200).send({
        message: "Branch, content, and pull request created successfully",
        pullRequestUrl: pullRequestResponse.data.html_url,
      });
    } catch (error) {
      console.error("Error during API operation:", error.message);
      if (error.response && error.response.status === 401) {
        res.status(401).send("Unauthorized: Bad credentials");
      } else {
        res
          .status(500)
          .send(error.response ? error.response.data : "Unknown error");
      }
    }
  });
});

exports.listBranches = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    res.set("Access-Control-Allow-Origin", "*");
    res.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.set("Access-Control-Allow-Headers", "Content-Type, Authorization");

    if (req.method === "OPTIONS") {
      res.status(204).send("");
      return;
    }

    const { token, repo } = req.query;

    const headers = {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github.v3+json",
    };

    const baseUrl = `https://api.github.com/repos/${repo}/branches`;

    try {
      // Check if the token is valid
      await axios.get("https://api.github.com/user", { headers });

      const response = await axios.get(baseUrl, { headers });
      res.status(200).json(response.data);
    } catch (error) {
      console.error("Error fetching branches:", error.message);
      if (error.response && error.response.status === 401) {
        res.status(401).send("Unauthorized: Bad credentials");
      } else {
        res
          .status(500)
          .send(error.response ? error.response.data : "Unknown error");
      }
    }
  });
});
