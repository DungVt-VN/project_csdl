const Client = require('H:/VuTienDung/Co_So_Du_Lieu/Project_CK/src/config/db')

const client = Client.myconnection;

class SiteController {
    // [GET] /
    home(req, res) {
        var check = {name: "Nhap PassWord"}
        res.render('home',check);
    }

    async postadmin(req, res) {
        var values = req.body.pass_admin;
        client.query("SELECT passwords FROM _user WHERE _username='Admin'", (err, result) =>{
            var values2 = result.rows[0];
            if(values == values2.passwords){
                res.redirect('admin');
            }else{
                res.redirect('pass_wrong');
            }
        });
    } 


}
module.exports = new SiteController();
