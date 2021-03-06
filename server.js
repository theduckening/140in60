var fs = require("fs");
var express = require("express");
var favicon = require("serve-favicon");
var http = require("http");
var https = require("https");
var bodyParser = require("body-parser");
var path = require("path");
var morgan = require("morgan");
var mongoose = require("mongoose");
var helmet = require("helmet");
var config = require("./config.js");
var passport = require("passport");
var exphbs = require("express-handlebars");
var app = express();


app.set("port", process.env.PORT || 1198);

app.use(morgan("dev"));
app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, "public")));
app.use(favicon(path.join(__dirname, "public/images/favicontwo.ico")));
app.set("views", path.join(__dirname, "public/views"));
app.engine(".hbs", exphbs({defaultLayout: "layout",
  layoutsDir: path.join(__dirname, "public/views/layouts"),
  partialsDir: path.join(__dirname, "public/views/partials"),
  extname: ".hbs"
}));

app.use(passport.initialize());

mongoose.connect(config.db);
var httpServer = http.createServer(app);
var io = require("socket.io")(httpServer);


io.on("connection", function(socket){
  console.log("Unsecure Connection: New User.");

  socket.on("disconnect", function(){
    console.log("User disconnect.");
  });
});

require("./routes.js")(app, io);


httpServer.listen(app.get("port"), function(){
  console.log("Unsecure Port: %s", app.get("port"));
});
