\c postgres
DROP DATABASE IF EXISTS project;
CREATE DATABASE project;
\c project;

-- table 1--
CREATE TABLE _ROLE(
    role_id                 INT             NOT NULL    PRIMARY KEY,
    role_name               VARCHAR(255)    NOT NULL,
    salary                  MONEY           NOT NULL,
    UNIQUE(role_name)
);
-- table 2--
CREATE TABLE CLIENT(
    client_id               BIGSERIAL       NOT NULL    PRIMARY KEY,
    client_ne               VARCHAR(255)    NOT NULL,
    email                   VARCHAR(255)    NOT NULL,
    telephone               VARCHAR(255)    NOT NULL,
    UNIQUE(telephone)
);

-- table 4--

CREATE TABLE STAFF(
    staff_id                BIGSERIAL       NOT NULL    PRIMARY KEY,
    first_name              VARCHAR(255)    NOT NULL,
    last_name               VARCHAR(255)    NOT NULL,
    email                   VARCHAR(255)    NOT NULL,
    telephone               VARCHAR(255)    NOT NULL,
    date_begin              DATE            NOT NULL,
    count_hd                BIGINT          ,
    link_img                VARCHAR(255),
    he_so                   FLOAT           NOT NULL,
    manage_by    BIGINT     REFERENCES      STAFF(staff_id),
    role_id      BIGINT     REFERENCES      _ROLE (role_id),
    UNIQUE(telephone)
);

CREATE TABLE CHINHANH(
    id_cn                   BIGSERIAL       NOT NULL    PRIMARY KEY,
    ten_cn                  VARCHAR(255)    NOT NULL,
    _address                VARCHAR(255)    NOT NULL,
    quan_li       BIGINT    REFERENCES      STAFF(staff_id) NOT NULL
);

-- table 6-- 

CREATE TABLE _user(
    id_user                 BIGSERIAL       NOT NULL    PRIMARY KEY,
    _username               VARCHAR(255)    NOT NULL,
    passwords               VARCHAR(255)    NOT NULL,
    staff_id   BIGINT       REFERENCES    STAFF(staff_id) NOT NULL
);

-- table 7--

CREATE TABLE HOPDONG(
    hd_id                   BIGSERIAL       NOT NULL    PRIMARY KEY,
    actual_date             DATE,                     -- ngày tra máy thực tế--
    _status                 BOOLEAN         NOT NULL,
    tiencoc                 MONEY           NOT NULL,
    payment_date            DATE            NOT NULL, -- ngày trả dự kiến--
    thanh_toan              MONEY, --tính tiền hợp đồng thay đổi khi hợp đồng hoàn thành--
    client_id  BIGINT       REFERENCES      CLIENT(client_id),
    staff_id   BIGINT       REFERENCES      STAFF(staff_id),
    id_cn      BIGINT       REFERENCES      CHINHANH(id_cn)
);

CREATE TABLE MACHINE(
    mce_id                  BIGSERIAL       NOT NULL    PRIMARY KEY,
    mce_name                VARCHAR(255)    NOT NULL,
    _money                  MONEY           NOT NULL,
    compn                   VARCHAR(255)    NOT NULL,
    dateomft                DATE            NOT NULL,
    maintenance             DATE            NOT NULL,
    _status                 BOOLEAN         NOT NULL,
    link_img                VARCHAR(255),
    chinhanh      BIGINT    REFERENCES      CHINHANH(id_cn) NOT NULL
);

CREATE TABLE GIAODICH(
    id_thue     BIGSERIAL       NOT NULL        PRIMARY KEY,
    rental_date DATE            NOT NULL, -- ngày cho thuê --
    hd_id       BIGINT          REFERENCES      HOPDONG(hd_id),
    nv_giao     BIGINT          REFERENCES      STAFF(staff_id),
    mce_id      BIGINT          REFERENCES      MACHINE(mce_id),
    diachigiao  VARCHAR(255)    NOT NULL
);
----------------------------------------------------------------
----------------------------------------------------------------
----------------------------------------------------------------
----------------------------------------------------------------
----------------------------------------------------------------







--Trigger 1 Update hệ số lương theo thời gian làm việc

DROP FUNCTION IF EXISTS he_so_luong;
CREATE OR REPLACE FUNCTION he_so_luong()
RETURNS trigger AS

$$
BEGIN
    UPDATE STAFF SET he_so = ((NOW()::date - STAFF.date_begin)/100*0.1);
    RETURN null;
END;
$$
LANGUAGE plpgsql;
CREATE trigger he_so_luong
    AFTER INSERT OR UPDATE OR DELETE ON STAFF 
    FOR EACH ROW
    when(pg_trigger_depth() <1)
EXECUTE PROCEDURE he_so_luong();


--Trigger 2--
DROP FUNCTION IF EXISTS tinh_so_hop_dong;
CREATE OR REPLACE FUNCTION tinh_so_hop_dong()
RETURNS trigger AS

$$
BEGIN
    UPDATE STAFF SET count_hd = (count_hd + 1) 
    WHERE staff_id = (
            SELECT staff_id FROM HOPDONG 
            WHERE hd_id = NEW.hd_id);
    
    UPDATE STAFF SET count_hd = (count_hd + 1) 
    WHERE staff_id = (
        SELECT manage_by 
        FROM STAFF 
        WHERE staff_id = (
            SELECT staff_id 
                FROM HOPDONG  
                WHERE hd_id = NEW.hd_id
        )
    );   
    
    
    RETURN null;
END;
$$
LANGUAGE plpgsql;
CREATE trigger tinh_so_hop_dong
    AFTER INSERT OR UPDATE OR DELETE ON HOPDONG 
    FOR EACH ROW
    when(pg_trigger_depth() <1)
EXECUTE PROCEDURE tinh_so_hop_dong();





--funcion 1: dùng để kêt thúc hợp đồng và đưa ra số tiền cần thanh toán
CREATE OR REPLACE FUNCTION So_Tien_Phai_Tra (ma_hd integer)     
RETURNS money
LANGUAGE plpgsql
as
$$
DECLARE
okane money;
BEGIN    
    UPDATE HOPDONG SET actual_date = now()::date
    WHERE hd_id = ma_hd;
    UPDATE HOPDONG SET _status = 't'
    WHERE hd_id = ma_hd;

    if(now()::date != (select payment_date from HOPDONG WHERE hd_id = ma_hd))
	then
        UPDATE HOPDONG SET thanh_toan = (SELECT sum((HOPDONG.actual_date - GIAODICH.rental_date)*MACHINE.mce_id*1.25) 
                FROM HOPDONG
                INNER JOIN GIAODICH ON HOPDONG.hd_id = GIAODICH.hd_id
                INNER JOIN MACHINE  ON GIAODICH.mce_id = MACHINE.mce_id
                WHERE HOPDONG.hd_id = ma_hd
                GROUP BY GIAODICH.hd_id)
                WHERE HOPDONG.hd_id = ma_hd;
    else
        UPDATE HOPDONG SET thanh_toan = (SELECT sum((HOPDONG.actual_date - GIAODICH.rental_date)*MACHINE.mce_id) 
                FROM HOPDONG
                INNER JOIN GIAODICH ON HOPDONG.hd_id = GIAODICH.hd_id
                INNER JOIN MACHINE  ON GIAODICH.mce_id = MACHINE.mce_id
                WHERE HOPDONG.hd_id = ma_hd
                GROUP BY GIAODICH.hd_id)
                WHERE HOPDONG.hd_id = ma_hd;
    END if;
	okane = (SELECT thanh_toan - tiencoc FROM HOPDONG
	WHERE HOPDONG.hd_id = ma_hd);
	RETURN okane;
END
$$;

-- funcion 2: tính số lượng máy trong hợp đông--

CREATE OR REPLACE FUNCTION So_Luong_May (ma_hd bigint)     
RETURNS int
LANGUAGE plpgsql
as
$$
DECLARE
so_luong int ;
BEGIN    
    so_luong = (select count(hd_id) from GIAODICH
    WHERE hd_id = ma_hd
    GROUP BY hd_id);
	RETURN so_luong;
END
$$;

--view 1 dùng để xem thông tin cơ bản và lương của nhân viên
CREATE VIEW _STAFF AS
    SELECT staff_id, first_name, last_name,_ROLE.role_name, STAFF.he_so*_ROLE.salary AS SALARY
    FROM STAFF INNER JOIN _ROLE ON STAFF.role_id = _ROLE.role_id;

--tạo 2 view dùng để xem danh sách những hợp đồng và giá trị của của các bản hợp đồng và số lượng máy
CREATE VIEW _HD AS
    SELECT HOPDONG.hd_id, CLIENT.client_ne as Khach_Hang, STAFF.first_name as Nhan_Vien, CHINHANH.ten_cn as Chi_Nhanh, HOPDONG.thanh_toan, So_Luong_May(HOPDONG.hd_id)
    FROM HOPDONG
    INNER JOIN STAFF ON HOPDONG.staff_id = STAFF.staff_id
    INNER JOIN CHINHANH ON HOPDONG.id_cn = CHINHANH.id_cn
    INNER JOIN CLIENT ON HOPDONG.client_id = CLIENT.client_id;



--Tạo index----
CREATE INDEX staff_name ON public.staff USING btree (first_name);
CREATE INDEX machine_name ON public.machine USING btree (mce_name);
CREATE INDEX client_name ON public.CLIENT USING btree (client_ne);

----------------------------------------------------------------
----------------------------------------------------------------
----------------------------------------------------------------
----------------------------------------------------------------
----------------------------------------------------------------
----------------------------------------------------------------

