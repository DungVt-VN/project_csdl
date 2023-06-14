
const siteRouter = require('./site');
const staffRouter = require('./staff');
const adminRouter = require('./admin');
const guestRouter = require('./guest');
const pass_wrongRouter = require('./pass_wrong');

function route(app) {
    app.use('/guest', guestRouter);
    app.use('/staff', staffRouter);
    app.use('/admin', adminRouter);
    app.use('/pass_wrong', pass_wrongRouter);
    app.use('/', siteRouter);
    
}
module.exports = route;
