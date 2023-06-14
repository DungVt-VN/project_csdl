class Pass_wrongController {
    // [GET] /
    wrong(req, res) {
        res.render('pass_wrong');
    }
}

module.exports = new Pass_wrongController();
