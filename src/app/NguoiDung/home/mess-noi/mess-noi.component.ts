import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { ServerHttpService } from 'src/app/data/server-http.service/server-http.service';
import { DataServiceService } from 'src/app/data/dataService/data-service.service';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-mess-noi',
  templateUrl: './mess-noi.component.html',
  styleUrls: ['./mess-noi.component.css']
})
export class MessNoiComponent  {

  isDisabled=true;
  soLuong:number=1;
  thanhTien=0;
  dataGioHang:any;


  constructor(
    private datePipe: DatePipe,
    private serverHttpService:ServerHttpService,
    private sv:DataServiceService,
    public dialogRef: MatDialogRef<MessNoiComponent>,
    
  ) { }

  ngOnInit() {
   
   // this.getGioHang()
   this.getKho() ;
  }
  dataProduct:any;
  getKho() {
    this.serverHttpService.getKho().subscribe(
      (response) => {
        console.log('Get kho success:', response);
       
        this.  dataProduct= response;
        
        // lấy dữ liệu lên service
        this.sv.dataKho=response;
        // Lấy danh sách ảnh từ server và gán vào biến dataFromSV để hiển thị trong template
      },
      (error) => {
        console.log('Get  images error:', error);
      }
    );

  }


  dieuKien(){
    if(this.soLuong>=1&&this.soLuong<=10000){
      this.isDisabled=false;
      this.thanhTien= this.soLuong*(this.sv.dataKho[this.idKho].DonGia-(this.sv.dataKho[this.idKho].DonGia*this.sv.dataKho[this.idKho].GiamGia/100))
      return true
    }
   
    else 
     {
      this.isDisabled=true;
      this.thanhTien=0; return false
     }
    
  }


  off(){
    this.dialogRef.close();
  }

  close(): void {
   this. them()
    this.dialogRef.close();
  }

  dataKho=this.sv.dataKho;
  idKho:number=this.sv.IDKho;
  
  //thêm vào giỏ hàng
  them(){
   
   //tao 1 bien check xem san pham co trong gio hang chua
    let checkGioHang=false ;

    for (const num of this.sv.dataGioHang) {
      console.log(num.SanPhamID);
      if(num.SanPhamID===this.sv.datahome.SanPhamID) checkGioHang=true ;
    }
    
    if(checkGioHang){
     // this.getGioHang();
      let IDGioHang=-1;

      //lấy id trong giỏ hàng
      for(let i=0;i<this.dataGioHang.length;i++  ){
        if(this.sv.IDnameLogin===this.dataGioHang[i].TaiKhoanID&&this.dataKho[this.idKho].ID===this.dataGioHang[i].SanPhamID)
        IDGioHang=i
      }
        let soLuongTang =this.dataGioHang[IDGioHang].SoLuong+=this.soLuong;
      // nếu số lượng trong giỏ hàng lớn hơn số lượng trong Kho thì thông báo
      if(soLuongTang>this.dataKho[this.idKho].SoLuongHH){
        alert("Rất tiết số lượng đã đến giới hạn");
      }else{
         //cap nhat so luong trong gio hang
      
      this.thanhTien= soLuongTang*(this.dataKho[this.idKho].DonGia-(this.dataKho[this.idKho].DonGia*this.dataKho[this.idKho].GiamGia/100))
      this.dataGioHang[IDGioHang].ThanhTien=this.thanhTien
      //gọi hàm udat giỏ hàng dể udat
      this.serverHttpService.updatGioHang1(this.dataGioHang[IDGioHang],this.dataGioHang[IDGioHang].ID).subscribe(
        (response) => {
       //   alert('Upload success:'+ response);
          console.log('Upload success:');
          
          //this.getKho(); // Sau khi upload thành công, gọi lại hàm để cập nhật danh sách ảnh từ server
          alert('Thêm Thành công:');
          this.off()
        },
        (error) => {
          console.log('Upload error:');
          alert('Upload error:');
        }
      );
      }
      
    }
   else if(this.soLuong>this.dataKho[this.idKho].SoLuongHH){
    alert("Rất tiếc số lượng đã đến giới hạng");
   }
    else {
     
      let trangThai=1;//trang thái 1 là trong giỏ hàng, 2 admin chấp nhận mua , 3  admin hủy
      /// không có trong giỏ hàng thì thêm vào
      this.themGioHang(trangThai);
    }

        
  }

  cardOTD={
    purchaseDate:this.getCurrentDate(),
    quantityCart:0,
    userId:0,
    productId:0,
    status:1
  }
  //hàm lấy tg hiện tại
  getCurrentDate(): string {
    const currentDate = new Date();
    return this.datePipe.transform(currentDate, 'yyyy-MM-dd')!;
  }
  themGioHang(trangThai:number){
    if(this.  dataProduct[this.sv.IDKho].quantity>=this.soLuong)
    {
      if(this.dataKho)
      this.cardOTD.quantityCart=this.soLuong;//lấy số lượngSoLuongHH
      this.cardOTD.purchaseDate=this.getCurrentDate();
      this.cardOTD.userId= this.sv.IDnameLogin;
      this.cardOTD.productId=this.sv.productId
  
  
      this.serverHttpService.themGioHang(this.cardOTD).subscribe(
        (response) => {
       //   alert('Upload success:'+ response);
          console.log('Upload success:');
         // this. suaProduct(this.soLuong,this.sv.productId);
          //this.getKho(); // Sau khi upload thành công, gọi lại hàm để cập nhật danh sách ảnh từ server
          alert('Thêm Thành công:');
          this.off()
        },
        (error) => {
          console.log('Upload error:');
          alert('Upload error1:');
          console.log(this.sv.datahome)
        }
      );
    }
    else alert('Rất tiếc số đã đến số lượng giới hạn');
    this.soLuong=this. dataProduct[this.sv.IDKho].quantity;
    
  }
  

 
  //giảm số lượng sau khi mua

 

}
