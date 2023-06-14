const Client = require('H:/VuTienDung/Co_So_Du_Lieu/Project_CK/src/config/db');
const client = Client.myconnection;


class GuestController {
    search(req, res) {
        var values1 = req.query._name;

        client.query("SELECT Ten_thiet_bi, Nha_san_xuat, link_anh  FROM Thiet_bi_xay_dung GROUP BY Ten_thiet_bi, Nha_san_xuat, link_anh ORDER BY Ten_thiet_bi", (err, result) =>{
            if(err){
                console.log(err);
            }else{
                res.render('guest',{values:result.rows});
            }
        });
    }
    // [GET] /
    guest(req, res) {
        client.query("SELECT Ten_thiet_bi, Nha_san_xuat, link_anh  FROM Thiet_bi_xay_dung GROUP BY Ten_thiet_bi, Nha_san_xuat, link_anh ORDER BY Ten_thiet_bi", (err, result) =>{
            if(err){
                console.log(err);
            }else{
                res.render('guest',{values:result.rows});
            }
        });
    }

    async post_insert_tam(req, res){
        var values = req.body.name;
        var values1 = req.body.telephone;
        var values2 = req.body.email;
        var values3 = req.body.name_sp;
        var check = "Bạn đã đăng ký thành công!";
        var check2 = "Đăng ký không thành công!";
        var check3 = "http://localhost:8080/"
        client.query("INSERT INTO  _tam_thoi (_name,telephone,email,name_sp) VALUES ( '"+values+"', '"+values1+"','"+values2+"','"+values3+"')", (err, result)  =>{
            if (err){
                res.render('regis_done',{values:check2, values1: check3});
            }else{
                res.render('regis_done', {values:check, values1: check3});
            }

        });

        
    }
}

module.exports = new GuestController();
