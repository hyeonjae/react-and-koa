const Koa = require('koa');
const path = require('path');
const bodyParser = require('koa-bodyparser');
const serve = require('koa-static');
const Router = require('koa-router');
const cors = require('koa2-cors');

require('dotenv').config();

// const app = express();
const port = process.env.PORT || 4000;

const app = new Koa();
const router = new Router();

// API calls
router.get('/api/hello', (ctx, next) => {
  ctx.body = { Koa: 'Hello From Koa' }
});

router.post('/api/world', (ctx, next) => {
  const { req } = ctx;
  console.log(req.body);
  ctx.body = `I received your POST request. This is what you sent me: ${req.body}`
});

if (process.env.NODE_ENV === 'production') {
  router.get('*', (ctx, next) => {
    ctx.res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
  });
  app.use(serve(path.join(__dirname, 'client/build')));
}

app.use(cors({
  origin: function(ctx) {
    return '*';
  },
  exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'],
  maxAge: 5,
  credentials: true,
  allowMethods: ['GET', 'POST', 'DELETE'],
  allowHeaders: ['Content-Type', 'Authorization', 'Accept'],
}));
app.use(bodyParser());
app.use(router.routes());

require('./server/passport.js').setup(app);

app.listen(port, () => console.log(`Listening on port ${port}`));