import { Component, ViewChild, OnInit } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';

import { Router } from '@angular/router';
import { DataServiceService } from './data/dataService/data-service.service';
import { ServerHttpService } from './data/server-http.service/server-http.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {

  public Login:boolean=false;
  title = 'HelloWorld';
  @ViewChild('sidenav', { static: true }) sidenav!: MatSidenav;
  
  public isOpened = false;
  public totalStudents = 0;
  public loaiTK='';
  taiKhoan='';


  
  ngOnInit(): void {
   
    this.isOpened = false;
  
  }
  constructor(public http:ServerHttpService ,public sv:DataServiceService,private rt:Router,private serverHttpService: ServerHttpService ){
    this.getGioHang()
  }
  soLuong=this.sv.soLuongDuyet;
  
  logOut(){
    this.Login=false;
    this.rt.navigate(['/']);
    this.sv.reset();
  }
  home(){
    
   this.rt.navigate(['/home']);
  }
public openLeftSide() {
  
  this.isOpened = !this.isOpened;
  this.sidenav.toggle();
  
}
  public closeLeftSide() {
    this.isOpened = false;
  }
  dataGioHang:any;
   getGioHang() {
    let trangThai=2;//trang thai mua hang =1 là đang ở trong giỏ //2 là đang nằm trong giỏ hàng duyệt của admin
    this.serverHttpService.getAllGioHang(trangThai).subscribe(
      (response) => {
  
        this.dataGioHang= response;
     //   this.sv.soLuongDuyet=this.dataGioHang.length;
     
        // Lấy danh sách ảnh từ server và gán vào biến dataGioHang để hiển thị trong template
      },
      (error) => {
        console.log('Get images error:', error);
      }
    );
  }

}


