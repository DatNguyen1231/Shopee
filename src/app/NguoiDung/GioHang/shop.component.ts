import { Component, OnInit, ElementRef, AfterViewInit, ViewChild } from '@angular/core';
import { ServerHttpService } from '../../data/server-http.service/server-http.service';
import { DataServiceService } from '../../data/dataService/data-service.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.css']
})
export class ShopComponent implements OnInit {
  nameLogin=this.sv.nameLogin;
  
  
  dataGioHang: any;
 // layDataGioHang={SoLuong:0,ThanhTien:0}
  idDelete: number=-1;
  currentDate: string='';

  constructor (private datePipe: DatePipe,public sv:DataServiceService,private serverHttpService: ServerHttpService) { }
 
  ngOnInit(): void {
  this. getGioHang();
  this. getKho()
   
  }



  
  checkALL(){
    //khở tạo cho biến isAllSelected
    for (let i = 0; i < this.dataGioHang.length; i++) {
      
      this.sv.isAllSelected[i] = false;
      
    }
  //check all hoặc bỏ check
    if(this.sv.check)
    for (let i = 0; i < this.dataGioHang.length; i++) {
      
      this.sv.isAllSelected[i] = true;

    }
    else  for (let i = 0; i < this.dataGioHang.length; i++) {
      
      this.sv.isAllSelected[i] = false;

    }

   
  }
  //tính tổng số tiền đc check
  getTongTien(){
    let tong=0;
   
    for (let i = 0; i < this.dataGioHang.length; i++) {
      
      if(this.sv.isAllSelected!==null &&this.sv.isAllSelected[i] ){
       
         tong+= (this.dataGioHang[i].quantityCart*this.dataGioHang[i].product.price)
      }
      
      
    }
   return tong;
  }
  //lấy data giỏ hàng từ api
  getGioHang() {
   
    this.serverHttpService.getGioHang(this.sv.IDnameLogin,1).subscribe(
      (response) => {
        console.log('get gio hang:', response);
        this.dataGioHang= response;
       
       console.log(response)
        // Lấy danh sách ảnh từ server và gán vào biến dataGioHang để hiển thị trong template
      },
      (error) => {
        console.log('Get images error:', error);
      }
    );
  }
  //nút thêm hoặc giảm
  btnAdd(index:number ,i:number){
   
   // this.dataCart.status=trangThai;//là trạng thái sp nằm trong giỏ hàng 
    
  
    let trangThai=1
        //trang thai gio hang 1 nằm trong giỏ hàng người dùng,2,3,4 
    if( this.dataGioHang[index].quantityCart>0){
     
      this.suaGioHang(index,trangThai,this.dataGioHang[index].quantityCart+i);
      
    }
    else {this.xoaGioHang(this.dataGioHang[index].cartID)}
      
  }
 
 //xóa giỏ hàng
  xoaGioHang(index: number) {
    this.serverHttpService.xoaGioHang(index).subscribe((data) => {
    
    }, (error) => {
      console.log('Get images error:', error);
      this.getGioHang();
    });
   
  }
  dataProductUpload={
    name:'',
    price:0,
    imageData:"",
    quantity:0
  }

  dataProduct:any;
  getKho() {
    this.serverHttpService.getKho().subscribe(
      (response) => {       
        this.dataProduct=response;
        console.log(response)
      },
      (error) => {
        console.log('Get images error:', error);
      }
    );
  }

  suaProduct( soluong:number,idProduct:number){

    this.getKho()
    this.dataProductUpload.name= this.dataProduct[idProduct].name;
    this.dataProductUpload.price= this.dataProduct[idProduct].price;
    this.dataProductUpload.imageData= this.dataProduct[idProduct].imageData;
    console.log( this.dataProduct[idProduct].name)
   // this.dataProductUpload.quantity= this.dataProduct[idProduct].product.Quantity-soluong;
    this.dataProductUpload.quantity=10


    // console.log(this.dataProduct)
    // this.serverHttpService.suaKho(this. dataProductUpload,idProduct).subscribe(
    //   (response) => {
    //     console.log('Upload success:', response);
    //   //  alert('put success.');
    //    this.getKho()
    //   },
    //   (error) => {
    //     console.log('Upload error:', error);
    //     alert('Upload error.');
    //   })

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
  checkSoLuong:boolean=false;
  suaGioHang(index:number,trangthai:number,soLuong:number){
    this.checkSoLuong=false;
    if(this.dataGioHang[index].quantityCart<=0 )
    {
      this.dataGioHang[index].quantityCart=1;
    }
    else if(this.dataGioHang[index].quantityCart>this.dataGioHang[index].product.quantity){
      alert("Rất tiết số lượng đã đạt đến giới hạn");
      this.getGioHang();
    }
    else{
      
      this.dataCart.status=trangthai;
      this.dataCart.purchaseDate=this. getCurrentDateTime();
      this.dataCart.quantityCart=soLuong


      this.serverHttpService.updatGioHang1( this.dataCart , this.dataGioHang[index].cartID ).subscribe(
        (respon) => {
          console.log("thành công")
          this.getGioHang();
          this. getTongTien()
        },
        (error) => {
          console.log('Upload error:');
        }
      );
    } 
   
  }

  // themGioHangDaMua(data:any,ID:number){
  //   this.serverHttpService.themGioHangDaMua(data,ID).subscribe(
  //     (response) => {
  //    //   alert('Upload success:'+ response);
  //       console.log('Upload success:');
        
  //       //this.getKho(); // Sau khi upload thành công, gọi lại hàm để cập nhật danh sách ảnh từ server
  //      // alert('Thêm Thành công:');
  //     },
  //     (error) => {
  //       console.log('Upload error:');
  //       alert('Upload error1:');
  //       console.log(this.sv.datahome)
  //     }
  //   );
  // }

  inputUpdat(i:number,trangThai:number){
    this.suaGioHang(i,1,this.dataGioHang[i].quantityCart);
  }
  data={NgayMua:''}
  //btn mua 
  mua(){
    
   for(let i=0 ;i< this.dataGioHang.length; i++ ){

    if(this.sv. isAllSelected[i]){
     
      this.suaGioHang(i,2,this.dataGioHang[i].quantityCart);
      console.log(this.dataGioHang[i].product.id);
      //this.suaProduct(10,this.dataGioHang[i].product.id)
      this.getKho()
    }
   
   }
   

  //  for(let i=0 ;i< this.dataGioHang.length; i++ ){

  //   if(this.sv. isAllSelected[i]){
     
  //     this.xoaGioHang(this.dataGioHang[i].ID)
  //     console.log(this.data,this.dataGioHang[i].ID);
  //   }
   
  //  }
    // Sử dụng toán tử ?? để xác định giá trị mặc định là chuỗi rỗng ('') nếu giá trị trả về là null
    
  }
}
  