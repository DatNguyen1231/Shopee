
import { Injectable } from '@angular/core';
import {
  HttpHeaders,
  HttpClient,
  HttpErrorResponse,
} from '@angular/common/http';
import { throwError } from 'rxjs/internal/observable/throwError';
import { Observable } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class ServerHttpService {
  
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      // Authorization: 'my-auth-token',
      // Authorization: 'Basic ' + btoa('username:password'),
    }),
  };

  private REST_API_SERVER = 'http://localhost:8083';


  constructor( private httpClient :HttpClient) { }

public login(user: any): Observable<any> {
    const url = `${this.REST_API_SERVER}/login/login`;
    return this.httpClient
      .post<any>(url, user, this.httpOptions)
      .pipe(catchError(this.handleError));
  }
  public addUser(user: any): Observable<any> {
    const url = `${this.REST_API_SERVER}/login/add`;
    return this.httpClient
      .post<any>(url, user, this.httpOptions)
      .pipe(catchError(this.handleError));
  }
  public xoaUser(id:number){
    const url = `${this.REST_API_SERVER}/Login/${id}`;
    return this.httpClient.delete<any>(url)
  }
  public suaUser(id:number,data:any){
    const url = `${this.REST_API_SERVER}/login/put/${id}`;
    return this.httpClient
      .put<any>(url,data, this.httpOptions)
  }
  
    //Kho
  public timKho(ten:string):Observable<any>{

    const url = `${this.REST_API_SERVER}/product/get/name/${ten}`;
    return this.httpClient
      .get<any>(url, this.httpOptions)  
  }
  public getKho():Observable<any>{

    const url = `${this.REST_API_SERVER}/product/get`;
    return this.httpClient
      .get<any>(url, this.httpOptions)  
  }

  public themKho(product:any){
      

      const url = `${this.REST_API_SERVER}/product/add`;
      return this.httpClient
        .post<any>(url, product , this.httpOptions)
        .pipe(catchError(this.handleError)); 
  }

  public xoaKho(id:number){
    const url = `${this.REST_API_SERVER}/product/delete/${id}`;
    return this.httpClient.delete<any>(url)
    .pipe(catchError(this.handleError)); 
    
  }
 public suaKho(data:any,id:number){
    const url = `${this.REST_API_SERVER}/product/put/${id}`;
    return this.httpClient
      .put<any>(url, data, this.httpOptions)
  }

  //GioHang
  getGioHang(userId:Number,status:number){
    const url = `${this.REST_API_SERVER}/cart/get/${userId}/${status}`;
    return this.httpClient
      .get<any>(url, this.httpOptions) 
  }
  getAllGioHang(trangThai:Number){
    const url = `${this.REST_API_SERVER}/cart/get/status/${trangThai}`;
    return this.httpClient
      .get<any>(url, this.httpOptions) 
  }
  public themGioHang(data:any){
 
    const url = `${this.REST_API_SERVER}/cart/add/`;
    return this.httpClient
      .post<any>(url, data, this.httpOptions)
      .pipe(catchError(this.handleError)); 
}

public xoaGioHang(id:number){
  const url = `${this.REST_API_SERVER}/cart/delete/${id}`;
  return this.httpClient.delete<any>(url)
}

public updatGioHang1(data:any,ID:number){
  const url = `${this.REST_API_SERVER}/cart/put/${ID}`;
  return this.httpClient
    .put<any>(url, data, this.httpOptions)
}
//Gio hang da ban
getALLGioHangDaMua(){
  const url = `${this.REST_API_SERVER}/cart/get/all`;
  return this.httpClient
    .get<any>(url, this.httpOptions) 
}

getGioHangDaMua(userId:Number){
  const url = `${this.REST_API_SERVER}/cart/get/user/${userId}`;
  return this.httpClient
    .get<any>(url, this.httpOptions) 
}

public themGioHangDaMua(data:any,id:number){
 
  const url = `${this.REST_API_SERVER}/cart/delqete/${id}`;
  return this.httpClient
    .post<any>(url, data, this.httpOptions)
    .pipe(catchError(this.handleError)); 
}

//Thông tin khách hàng

getThongTinKhachHang(IDTaiKhoan:Number){
  const url = `${this.REST_API_SERVER}/userprofile/get/${IDTaiKhoan}`;
  return this.httpClient
    .get<any>(url, this.httpOptions) 
}
getALLThongTinKhachHang(){
  const url = `${this.REST_API_SERVER}/ThongTinKhachHang/`;
  return this.httpClient
    .get<any>(url, this.httpOptions) 
}
//  themThongTinKhachHang(IDTaiKhoan:number){
 
//   const url = `${this.REST_API_SERVER}/ThongTinKhachHang/${IDTaiKhoan}`;
//   return this.httpClient
//     .post<any>(url, this.httpOptions)
//     .pipe(catchError(this.handleError)); 
// }
themThongTinKhachHang1(data:any){
 
  const url = `${this.REST_API_SERVER}/userprofile/add`;
  return this.httpClient
    .post<any>(url,data, this.httpOptions)
    .pipe(catchError(this.handleError)); 
}
suaThongTinKhachHang(data:any,IDLogin:number){
  const url = `${this.REST_API_SERVER}/userprofile/put/${IDLogin}`;
  return this.httpClient
    .put<any>(url, data, this.httpOptions)
}



  private handleError(error: HttpErrorResponse) {
  if (error.status === 0) {
    // A client-side or network error occurred. Handle it accordingly.
    console.error('An error occurred:', error.error);
  } else {
    // The backend returned an unsuccessful response code.
    // The response body may contain clues as to what went wrong.
    console.error(
      `Backend returned code ${error.status}, body was: `, error.error);
  }
  // Return an observable with a user-facing error message.
  return throwError(() => new Error('Something bad happened; please try again later.'));
}
}
