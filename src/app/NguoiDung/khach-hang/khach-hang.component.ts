import { Component, OnInit } from '@angular/core';
import { DataServiceService } from 'src/app/data/dataService/data-service.service';
import { ServerHttpService } from 'src/app/data/server-http.service/server-http.service';


interface Customer {
  ThayDoi:boolean;
  loginID: string;
  ten: string;
  gmail: string;
  sdt: string;
  gioiTinh: string;
  ngaySinh: string;
  matKhau: string;
}
@Component({
  selector: 'app-khach-hang',
  templateUrl: './khach-hang.component.html',
  styleUrls: ['./khach-hang.component.css']
})
export class KhachHangComponent implements OnInit{
  _thayDoi:boolean=true;
  pass:string='hihihihih';
  tyPe=false;
  _getThongTinKhachHang:any;

  passwordNL:string='';
 
   data = {
    profileID: 0,
    name: "",
    sex: "",
    birth: "",
    address: "",
    phoneNumber: "",
    userID:0
};
  data1=false;
  
  
  constructor(private sv:DataServiceService, private http: ServerHttpService) { }

  ngOnInit() {
   
    this.getThongTin();
    
    this.user. email=this.sv.nameLogin
   
  }
 
  
  thayDoiThongTin(){
    if (this.data1) {
      
      this.suaThongTin();
     // this.data1=false;
     // console.log("thành công")
    }
    else{
      this.themThongTin()
    }
  }
  user= {
    email: "",
    password:"",
    role: ""
}
  suaMk(){
  
    
    this.user. email=this.sv.nameLogin
    this.user.password=this.passwordNL;
    this.user.role="user";

    this.http.suaUser(this.sv.IDnameLogin,this.user).subscribe(
      (response) => {
       
        console.log(response);
      
      },
      (error) => {
       // this.data1=null;
        console.log('Get images error:', error);
      }
    );
  }
  suaThongTin(){

    
   console.log(this.data.sex)
    this.http.suaThongTinKhachHang(this.data,this.sv.IDnameLogin).subscribe(
      (response) => {
       
        console.log(response);
      
      },
      (error) => {
        console.log('Get images error:', error);
      }
    );
  }
  getThongTin() {
   
   

    this.http.getThongTinKhachHang(this.sv.IDnameLogin).subscribe(

      (response) => {
       
       
          this.data.profileID=response.profileID
          this.data.name=response.name
          this.data.sex=response.sex
          this.data.birth=response.birth
          this.data.address=response.address
          this.data.phoneNumber=response.phoneNumber
          //this.data.user.password=response.user.password;
        
          console.log(response)
          //this.data.user. email=response.user.email;
         // this.data.user.role=response.user.role;
          this.data1=true
        console.log("có j k"+response)
      
        //console.log("thông tin khách hàng",this.data);
        // Lấy danh sách ảnh từ server và gán vào biến dataFromSV để hiển thị trong template
      },
      (error) => {
        console.log('Get images error:', error);
        this.data1=false
      }
    );
  }
  
  themThongTin(){
    
  console.log("giới tính"+this.data)
  this.data.userID=this.sv.IDnameLogin
    this.http.themThongTinKhachHang1(this.data).subscribe(
      (response) => {
          console.log("thêm thông tin thành công")
      },
      (error) => {
        console.log('Upload success:');
        
      }
    );
  }
  
  thayDoiPass=true;
  hien(){
    this.tyPe=!this.tyPe;
    this.thayDoiPass=false;
    
  
  }
  thayDoi(){
   this._thayDoi=false;
   
  }
  xacNhanDoiMK(){
    if(this.user.password===this.passwordNL&&this.user.password!=null&&this.passwordNL!=null){
      this.suaMk();
      this.tyPe=!this.tyPe;
      this.thayDoiPass=!false;
      alert("Đổi mật khẩu thành công");
    }else alert('Mật khẩu nhập lại không đúng');

  }
  luuThayDoi(){
    this._thayDoi=true;
    this.thayDoiThongTin();
   // this.suaMk();
  
  }
  
}
