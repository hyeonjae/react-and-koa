const Koa = require('koa');
const path = require('path');
const bodyParser = require('koa-bodyparser');
const serve = require('koa-static');
const Router = require('koa-router');

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

app.use(bodyParser());
app.use(router.routes());

app.listen(port, () => console.log(`Listening on port ${port}`));