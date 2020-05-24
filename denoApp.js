import { Application } from './deps.js';
import errorHandler from './middlewares/errorHandler.js'
import router from './routes.js';

const port = 5050;
const app = new Application()


app.use(errorHandler)
app.use(router.routes())
app.use(router.allowedMethods())

console.log(`server running on ${port}`);

await app.listen({ port })
