import { Component, OnInit } from '@angular/core';
import{AppComponent} from 'src/app/app.component'
import { ServerHttpService } from 'src/app/data/server-http.service/server-http.service'
import { Router } from '@angular/router';
import { DataServiceService } from '../../data/dataService/data-service.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  userName:string='';
  passWord:string='';
  confirmpassWord:string='';
  idLogin=0;

  Mess:string='';

  dataUser:any=null;
  isDataLoaded: boolean = false;

  loai=false;

  dataUsers={
    email: this.userName,
    password: this.passWord,
    role:"user"
  }
ngOnInit() {
  
 
  //this.postUser();
}
  constructor(
    private sv:DataServiceService,
    private http:ServerHttpService,
    private app:AppComponent,
    private router: Router )
  { 
    
  }
  

 loGin(){
  this.dataUsers.email=this.userName
  this.dataUsers.password=this.passWord
  this.http.login(this.dataUsers).subscribe((data) => {
        this.dataUser = data;
        this.sv.IDnameLogin= this.dataUser.id
        this.sv.nameLogin=this.dataUser.email
        this.sv.isLoggedIn=true
        this.router.navigate(['/home'])
        this.app.Login = true;
        this.app.loaiTK=this.dataUser.role;
  }, (error) =>{
    this.Mess="Tài khoản mật khẩu không đúng";
    if(error===409){ this.Mess="Tài khoản đã tồn tại"}
  });
  
}


themtk(){
  this.dataUsers.email=this.userName
  this.dataUsers.password=this.passWord;
  if(this.dataUsers.password==this.confirmpassWord){
    this.http.addUser(this.dataUsers).subscribe((data)=>{
      alert('Tạo tài khoản thành công');
      this.Dangki()
    }, (error) =>{
     if(error.status===409)this.Mess="Tài khoản đã tồn tại";
    });
  }
  else{
    this.Mess="Mật khẩu nhập lại không đúng"
  }
    
  
}



  sai(){
    this.Mess='';
  }

 
  Dangki(){
   this.loai=!this.loai
     
  }

  //thêm vào bảng thong tin khách hàng
  xoaTK(index:number){
   //console.log(this.dataUser[index].TenDangNhap) 
    if(this.dataUser[index].TenDangNhap==="admin")
    alert("không thể xóa tài khoản admin");
    else{
      this.http.xoaUser(this.dataUser[index].ID).subscribe((data)=>{
        console.log("xóa thành công")
      //  this.postUser();
       }
      );
    }
   
  }
  clean(){
      this.userName='';
      this.passWord='';
      this.confirmpassWord='';
  }
}
