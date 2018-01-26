const app = global.app;
const home = require('./home');
const output = require('./output');
const api = require('./api');

app.get('/', home);
app.get('/output/:dirpath/:filename', output);
app.use('/api', api);
