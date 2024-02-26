import { Component } from '@angular/core';
import { DataServiceService } from 'src/app/data/dataService/data-service.service';
import { ServerHttpService } from 'src/app/data/server-http.service/server-http.service';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-duyet-don-hang',
  templateUrl: './duyet-don-hang.component.html',
  styleUrls: ['./duyet-don-hang.component.css']
})
export class DuyetDonHangComponent {

  dataGioHang:any;
  dataKho:any;
  //lấy id từ kh
  constructor (private datePipe: DatePipe,public sv:DataServiceService,private serverHttpService: ServerHttpService) {
    this.getGioHang()
    this.getKho();
   }
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
  
  suaKho(i:number,soLuong:number) {
  // this.getKho();
    let idKho=this.dataGioHang[i].product.id
    let id=-1;
    for(let i=0; i<this.dataKho.length;i++){
      
      if(this.dataKho[i].ID===idKho){
        id=i;
        console.log(id);
      }
    }
   this.dataKho[id].SoLuongHH-=soLuong;
   this.dataKho[id].DaBan+=soLuong;
   console.log("data kho là:",  this.dataKho)

    // console.log("id la",this.sv.dataKho[this.idKho].ID);

      this.serverHttpService.suaKho(this.dataKho[id],idKho).subscribe(
        (response) => {
          console.log('Upload success:', response);
        //  alert('put success.');
        this.getGioHang();
        },
        (error) => {
          console.log('Upload error:', error);
          alert('Upload error.');
        }
      );
      
    
    // Cập nhật ảnh lên server dựa trên index đã lưu và đồng thời cập nhật lại danh sách ảnh từ server
  }
  
  dataCart={
    status:1,
    purchaseDate:this. getCurrentDateTime(),
    quantityCart:0
  }
 
 
  getCurrentDateTime() {
    const currentDate = new Date();
    const formattedDate = this.datePipe.transform(currentDate, 'yyyy-MM-dd');
    
    return formattedDate;
  }
  suaGioHang(index:number,trangthai:number,){
    
    if(this.dataGioHang[index].quantityCart<=0 )
    {
      this.dataGioHang[index].quantityCart=1;
    }
    else if(trangthai!==4&&this.dataGioHang[index].quantityCart>this.dataGioHang[index].product.quantity){
      alert("Rất tiết số lượng đã đạt đến giới hạn");
      this.getGioHang();
    }
    else{
      
      this.dataCart.status=trangthai;
      this.dataCart.purchaseDate=this. getCurrentDateTime();
      this.dataCart.quantityCart=this.dataGioHang[index].quantityCart


      this.serverHttpService.updatGioHang1( this.dataCart , this.dataGioHang[index].cartID ).subscribe(
        (respon) => {
          console.log("thành công")
         if(trangthai!==4)this. suaProduct(this.dataGioHang[index].quantityCart ,this.dataGioHang[index].product.id)
       
       this.getGioHang();
        },
        (error) => {
          console.log('Upload error:');
        }
      );
    } 
   
  }
  dataProduct:any;
  getKho() {
    this.serverHttpService.getKho().subscribe(
      (response) => {       
        this.dataProduct=response;
      //  console.log(response)
      },
      (error) => {
        console.log('Get images error:', error);
      }
    );
  }
   
  dataProductUpload={
    name:'',
    price:0,
    imageData:"",
    quantity:0
  }

  suaProduct( soluong:number,idProduct:number){

    
    this.dataProductUpload.name=this.dataProduct[idProduct-1].name
    this.dataProductUpload.price=this.dataProduct[idProduct-1].price
    this.dataProductUpload.imageData=this.dataProduct[idProduct-1].imageData
    this.dataProductUpload.quantity=this.dataProduct[idProduct-1].quantity-soluong;
  //  console.log(idProduct)
    //console.log(this.dataProductUpload);
   // this.dataProduct[idProduct].quantity=this.dataProduct[idProduct].quantity-soluong;
   // console.log(this.dataProduct)
    this.serverHttpService.suaKho(this. dataProductUpload,idProduct).subscribe(
      (response) => {
   //     console.log('Upload success:', response);
      //  alert('put success.');
       this.getKho()
      },
      (error) => {
        console.log('Upload error:', error);
        alert('Upload error.');
      })

    
    this.getKho()
  }
  
}
