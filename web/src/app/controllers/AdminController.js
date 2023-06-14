const Client = require('H:/VuTienDung/Co_So_Du_Lieu/Project_CK/src/config/db')
const client = Client.myconnection;

class AdminController {
    // [GET] /
    deletenv(req, res) {
        var loi = "Sa Thải Không Thanh Cong! Thông Tin không hợp lệ"
        var loi2 = "Sa Thải Thành Cong"
        var link1 = "http://localhost:8080/admin";
        var values1 = req.body._name;
        var values2 = req.body._CCCD;

            client.query("SELECT ma_nv FROM Thong_tin_nhan_vien WHERE Ten_nhan_vien='"+values1+"' AND so_cccd='"+values2+"'", (err, result) =>{                                                     
                if(err){
                    res.render('regis_done',{values:loi, values1: link1});
                }else{
                    if(result.rows[0] == undefined){
                        res.render('regis_done',{values:loi, values1: link1});
                    }else{
                        var values3 = result.rows[0].ma_nv;
                        client.query("DELETE FROM _user WHERE ma_nv='"+values3+"'", (err, result)=>{
                            if (err){
                                res.render('regis_done',{values:loi, values1: link1});
                            }else{
                                client.query("DELETE FROM Thong_tin_nhan_vien WHERE ma_nv='"+values3+"'");
                                res.render('regis_done',{values:loi2, values1: link1});
                            }
                        });
                    }
                    
                }
            });
    }
    

    deletetb(req, res) {
        var loi = "Xóa không thành công! Máy đang được cho thuê."
        var loi2 = "Xóa thành công"
        var link1 = "http://localhost:8080/admin"
        var values1 = req.body._name;
        console.log(values1);
            client.query("DELETE FROM Thiet_bi_xay_dung WHERE ma_tb='"+values1+"'", (err, result)=>{
                if (err){
                    res.render('regis_done',{values:loi, values1: link1});
                }else{
                    res.render('regis_done',{values:loi2, values1: link1});
                }
            });
    }

    admin(req, res) {
        var values1;
        var values2;
        var values3;
        var values4;
        var values5;

        client.query("SELECT Ten_nhan_vien,So_hop_dong,images,so_cccd FROM Thong_tin_nhan_vien",(err, result)=>{
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
                res.render('admin',{ values1: values1, values2: values2, values3:values3, values4: values4, values5: values5});
            }
            
        });


    }

    posttb(req, res) {
        var values1 = req.body._name;
        var values2 = req.body.nsx;
        var values3 = req.body.ngaysx;
        var values4 = req.body.link_anh;
        var loi = "Insert Khong Thanh Cong"
        var loi2 = "Insert Thanh Cong"
        var link1 = "http://localhost:8080/admin"
        console.log(values3);
        client.query("INSERT INTO thiet_bi_xay_dung ( ten_thiet_bi, ngay_san_xuat, ngay_bao_duong_gan_nhat, nha_san_xuat, trang_thai, link_anh) VALUES ('"+values1+"','"+values3+"','"+values3+"', '"+values2+"',  'true','"+values4+"')", (err, result) =>{
            if(err){
                res.render('regis_done',{values:loi, values1: link1});
            }else{
                res.render('regis_done',{values:loi2, values1: link1});
            }
        });
    }

    postnv(req, res) {
        var values1 = req.body._name;
        var values2 = req.body._CCCD;
        var values3 = req.body.date_begin;
        var values4 = req.body.link_a;
        var values5 = req.body.user;
        var values6 = req.body.pass;
        var values7;
        var loi = "Insert Khong Thanh Cong"
        var loi2 = "Insert Thanh Cong"
        var link1 = "http://localhost:8080/admin"

        client.query("INSERT INTO Thong_tin_nhan_vien ( Ten_nhan_vien, So_CCCD, Ngay_bat_dau_lam_viec, So_hop_dong , images) VALUES ('"+values1+"','"+values2+"','"+values3+"', '0', '"+values4+"')", (err, result) => {
           if(err){
                    res.render('regis_done',{values:loi, values1: link1});
           } 
        });

        client.query("SELECT Ma_NV FROM Thong_tin_nhan_vien WHERE So_CCCD='"+values2+"'", (err, result) =>{ 
                if(err){
                    res.render('regis_done',{values:loi, values1: link1});
                }else{
                    values7 = result.rows[0].ma_nv;
                }
        });

        client.query("SELECT Ma_NV FROM Thong_tin_nhan_vien WHERE So_CCCD='"+values2+"'",(err, result) =>{
            if(err){
                    res.render('regis_done',{values:loi, values1: link1});   
            }else{
                client.query("INSERT INTO _user ( _username, passwords, Ma_NV ) VALUES ('"+values5+"','"+values6+"','"+values7+"')", (err, result) => {
                    if(err){
                        client.query("DELETE FROM Thong_tin_nhan_vien WHERE ma_nv= '"+values7+"'", (err, result) =>{
                            res.render('regis_done',{values:loi, values1: link1});
                        });
                    }else{
                        res.render('regis_done',{values:loi2, values1: link1});
                    }
                });
            }
        });
            
        

    }
}
module.exports = new AdminController();