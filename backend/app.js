const express = require("express");
const path = require("path");

const mongoConnect = require("./db/mongoConnect");
const {
  routesInit,
  originCorsAccess,
  fileUploadAccess,
} = require("./routes/app_routes");

let app = express();
app.use(express.json());

app.use(express.static(path.join(__dirname, "public")));
originCorsAccess(app);
fileUploadAccess(app);
routesInit(app);

// קוד חשוב שכאשר נעלה את השרת לענן אז נעבוד מול הפורט של
// השרת של הענן שלא תמיד יהיה 3001
let port = process.env.PORT || 3001;
app.listen(port);
