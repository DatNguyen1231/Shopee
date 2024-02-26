import { Component, OnInit, ElementRef, AfterViewInit, ViewChild } from '@angular/core';
import { from } from 'rxjs';
import { ServerHttpService } from 'src/app/data/server-http.service/server-http.service';


@Component({
  selector: 'app-kho',
  templateUrl: './kho.component.html',
  styleUrls: ['./kho.component.css']
})
export class KhoComponent implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef;
  @ViewChild('scrollToTop') scrollToTop!: ElementRef;
  //amount: number = 0;

  sua=false;
  selectedFile: File | null = null;
  base64textString = '';
  thanhtien:number=0;
  
  data = {
    TenHang: '',
    SoLuongHH: 0,
    DonGia: 0, 
    GiaGoc:0,
    GiamGia: 0,
    ThanhTien:0,
    DaBan:0,
    Anh: '',
   
    
  };

  sumThanhTien(){
    if(this.data.GiamGia>100)this.data.GiamGia=100;
    if(this.data.GiamGia<0)this.data.GiamGia=0;

    this.data.GiaGoc=this.data.DonGia*this.data.SoLuongHH;

    this.data.ThanhTien=this.data.GiaGoc-(this.data.GiaGoc*this.data.GiamGia/100);
   
  }

   IDUser = -1;

  seeImg = false;

 // dataFromSV: any;
  getDataUser:any
  key:string='';
 
  
  constructor(private serverHttpService: ServerHttpService,) { }
  
  
  ngOnInit() {
    this.getKho(); // Gọi hàm để lấy dữ liệu ảnh từ server khi component được khởi tạo
  }



  onFileSelected(event: any) {
    this.seeImg = true;
    this.selectedFile = event.target.files[0];
    if (this.selectedFile) {
      const reader = new FileReader();
      reader.onload = this.handleReaderLoaded.bind(this);
      reader.readAsBinaryString(this.selectedFile);
    }
  }

  handleReaderLoaded(e: any) {
    this.base64textString = 'data:image/png;base64,' + btoa(e.target.result);
    this.formData.imageData = this.base64textString;
    // Mã hóa ảnh thành base64 và gán vào biến data.img
  }

  getData(){
    
  }

  formData={
    name:'',
    price:0,
    imageData:"",
    quantity:0
  }

  themKho() {
    this.formData.name=this.data.TenHang;
   
    this.formData.price=this.data.DonGia;
    this.formData.quantity=this.data.SoLuongHH;
   

    console.log(this.formData)


      this.serverHttpService.themKho(this. formData ).subscribe(
        (response) => {
       //   alert('Upload success:'+ response);
          console.log('thêm thành công',"so luong:",this.data.SoLuongHH);
          this.getKho(); // Sau khi upload thành công, gọi lại hàm để cập nhật danh sách ảnh từ server
          this.clean();
        },
        (error) => {
          console.log('Upload error:');
          alert('Upload error:');
          this.getKho();
        }
      );
  
    //hiện nút sửa
   
  
  }

  clean(){
    this.data.TenHang = "";
    this.data.DonGia = 0;
    this.data.Anh ='';this.seeImg=false;
    this.data.SoLuongHH=0;
    this.data.ThanhTien = 0;
    this.data.GiamGia=0;
    const fileInput = document.getElementById('img');
    this.fileInput.nativeElement.value = '';
  }
  btnSua(i:number){
    this.getDataForm(i)
    this.sua=true;
  }
  getDataForm(index: number) {
    console.log( this. getDataUser);
    this.data.TenHang = this.getDataUser[index].name;
    this.data.DonGia = this.getDataUser[index].price;
    
    this.data.Anh = this.getDataUser[index].imageData;this.seeImg=true;
    this.data.SoLuongHH = this.getDataUser[index].quantity;
   
    this.scrollToTop.nativeElement.scrollIntoView({ behavior: 'smooth' });
    this.IDUser = index;
    // Lấy dữ liệu từ server và gán vào biến data, đồng thời cuộn lên vị trí đầu trang và lưu lại index của phần tử để xóa hoặc cập nhật sau này
  }
 
  suaKho() {

    
    
    if (this.IDUser !== -1) {
      this.getKho();
      this.getDataUser
      this.getDataUser[this.IDUser].name = this.data.TenHang;
      this.getDataUser[this.IDUser].price = this.data.DonGia;
      this.getDataUser[this.IDUser].imageData = this.data.Anh;
     // this.getDataUser[this.IDUser].GiamGia = this.data.GiamGia;
      this.getDataUser[this.IDUser].quantity = this.data.SoLuongHH;
    //  this.getDataUser[this.IDUser].ThanhTien = this.data.ThanhTien;

      this.serverHttpService.suaKho(this.getDataUser[this.IDUser],this.getDataUser[this.IDUser].id).subscribe(
        (response) => {
          console.log('Upload success:', response);
        //  alert('put success.');
          this.getKho(); // Sau khi cập nhật thành công, gọi lại hàm để cập nhật danh sách ảnh từ server
         
          this.IDUser = -1;
          console.log("thành công");
          this.clean();
        },
        (error) => {
          console.log('Upload error:', error);
          alert('Upload error.');
        }
      );
      
    } else {
      console.log("chọn đối tượng");
      alert('vui lòng chọn đối tượng".');
    }
    //ẩn nút sửa
    this.sua=false
    // Cập nhật ảnh lên server dựa trên index đã lưu và đồng thời cập nhật lại danh sách ảnh từ server
  }


  xoaKho(index: number) {
   
    this.serverHttpService.xoaKho(index).subscribe((data) => {
      this.getKho()

    },(error) => {
      console.log('Get images error:', error);
      this.getKho()

    });
  }

  getKho() {
    this.serverHttpService.getKho().subscribe(
      (response) => {       
        this.getDataUser=response;
      },
      (error) => {
        console.log('Get images error:', error);
      }
    );
  }
  searchByTenHang() {
    this.serverHttpService.timKho(this.key).subscribe(
      (response) => {
        console.log( response);
       
        this.getDataUser=response;
        // Lấy danh sách ảnh từ server và gán vào biến dataFromSV để hiển thị trong template
      },
      (error) => {
        console.log('Get images error:', error);
      }
    );
  
  }
  cancelSearch(){
    this. getKho() ;
  }
}
