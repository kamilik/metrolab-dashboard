const express = require('express');
const app = express();
const router = express.Router();

const path = __dirname + '/';
const port = 8080;

router.use(function (req,res,next) {
    console.log('/' + req.method);
    next();
  });
  
  router.get('/', function(req,res){
    res.sendFile(path + 'index.html');
  });
  
  router.get('/exit', function(req,res){
    res.sendFile(path + 'exit.html');
  });

  router.get('/maintaners', function(req,res){
    res.sendFile(path + 'maintaners.html');
  });

  router.get('/settings', function(req,res){
    res.sendFile(path + 'settings.html');
  });

  router.get('/sopry', function(req,res){
    res.sendFile(path + 'sopry.html');
  });

  router.get('/transactions', function(req,res){
    res.sendFile(path + 'transactions.html');
  });

app.use(express.static(path));
app.use('/', router);

app.listen(port, function () {
  console.log('Example app listening on port 8080!')
})