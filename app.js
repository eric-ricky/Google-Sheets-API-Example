import express from "express";
import { google } from "googleapis";

const app = express();

app.get("/", async (req, res) => {
  const auth = new google.auth.GoogleAuth({
    keyFile: "credentials.json",
    scopes: "https://www.googleapis.com/auth/spreadsheets",
  });

  // client instance for auth
  const client = await auth.getClient();

  //   instance of google sheets api
  const googleSheets = google.sheets({
    version: "v4",
    auth: client,
  });

  //   get metadata abt spreadsheet
  const spreadsheetId = "1NBjAVXImuolkjBg-CEZbLZhnKxeqJ7Mx7AeBnUmadL4";
  const metaData = await googleSheets.spreadsheets.get({
    auth,
    spreadsheetId,
  });

  // read rows from spreadsheet
  const getRows = await googleSheets.spreadsheets.values.get({
    auth,
    spreadsheetId,
    range: "Sheet1",
  });

  // write row(s) to spreedsheets
  await googleSheets.spreadsheets.values.append({
    auth,
    spreadsheetId,
    valueInputOption: "USER_ENTERED",
    range: "Sheet1",
    resource: {
      values: [
        ["2", "James", "50"],
        ["3", "Mercy", "40"],
      ],
    },
  });

  res.status(200).json({ msg: "Hello world", data:getRows.data.values });
});

const PORT = 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
