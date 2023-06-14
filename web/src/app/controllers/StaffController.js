const Client = require('H:/VuTienDung/Co_So_Du_Lieu/Project_CK/src/config/db');
const client = Client.myconnection;


class StaffController {
    // [GET] /

    async poststaff(req, res) {
        var values = req.body.user;
        var values1 = req.body.pass;
        client.query("SELECT * FROM _user WHERE _username= '"+values+"' AND passwords='"+values1+"'",(err, result) =>{
            var values2 = result.rows[0];
            if(values2 == undefined){
                res.redirect('pass_wrong')
            }else{
                var sess = req.session;  //initialize session variable
                sess.daDangNhap = true;
                sess.username = values;                  
                res.redirect("/staff");
            }
        });
    }

    


    staff(req, res) {
        var values1;
        var values2;
        var values3;
        var values4;
        var values5;
        var _username = req.session.username;
        var _user;
        var _id;

        client.query("SELECT Ten_nhan_vien FROM Thong_tin_nhan_vien INNER JOIN _user ON Thong_tin_nhan_vien.ma_nv = _user.ma_nv WHERE _username ='"+_username+"'",(err, result)=>{
            if(err){
                return console.error('error', err);
            }
                _user = result.rows[0].ten_nhan_vien;
                client.query("SELECT ma_nv FROM Thong_tin_nhan_vien WHERE Ten_nhan_vien ='"+_user+"'",(err, result)=>{
                    if(err){
                        return console.error('error', err);
                    }else{
                        _id = result.rows[0].ma_nv;
                    console.log(_id);
                        res.send("done");
                    }
                });
        });
        

        client.query("SELECT Ten_nhan_vien,So_hop_dong,images FROM Thong_tin_nhan_vien",(err, result)=>{
            if(err){
                return console.error('error', err);
            }
                values1 = result.rows;
        });

        client.query("SELECT Ten_thiet_bi, Nha_san_xuat, count(Ten_thiet_bi) FROM Thiet_bi_xay_dung GROUP BY Ten_thiet_bi, Nha_san_xuat ORDER BY Ten_thiet_bi",(err, result)=>{
            if(err) {
                console.log(err);
            }else{
                values2 = result.rows;
            }
            
        });

        client.query("SELECT * FROM _tam_thoi",(err, result)=>{
            if(err) {
                console.log(err);
            }else{
                values3 = result.rows;
            }
            
        });

        client.query("SELECT HD.ma_hd, NV.Ten_nhan_vien,TB.Ten_thiet_bi, HD.Ngay_bat_dau_thue, KH.Ten_khach_hang, TB.ma_tb FROM Hop_dong_cho_thue as HD INNER JOIN Thong_tin_khach_hang as KH ON HD.Ma_kh=KH.Ma_kh INNER JOIN Thong_tin_nhan_vien as NV ON HD.Ma_nv=NV.Ma_nv INNER JOIN Thiet_bi_xay_dung as TB ON HD.Ma_tb=TB.Ma_tb",(err, result)=>{
            if(err) {
                console.log(err);
            }else{
                values4 = result.rows;
            }
            
        });

        client.query("SELECT Ten_khach_hang, So_dien_thoai, Email FROM Thong_tin_khach_hang GROUP BY Ten_khach_hang, So_dien_thoai, Email",(err, result)=>{
            if(err) {
                console.log(err);
            }else{
                values5 = result.rows;
                res.render('staff',{ values1: values1, values2: values2, values3:values3, values4: values4, values5: values5});
            }
            
        });


    }


}


module.exports = new StaffController();
