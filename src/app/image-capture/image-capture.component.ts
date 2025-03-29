import { Component } from '@angular/core';
import { WebcamImage, WebcamModule } from 'ngx-webcam';
import { Subject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { jwtDecode } from 'jwt-decode';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-image-capture',
  standalone: true,
  imports: [WebcamModule, CommonModule],
  templateUrl: './image-capture.component.html',
  styleUrls: ['./image-capture.component.css']
})
export class ImageCaptureComponent {
  webcamImage: WebcamImage | null = null;
  private trigger: Subject<any> = new Subject<any>(); //sends events that start WebCam
  userId: string | null = null;

  constructor(private http: HttpClient, private router: Router) { 
  
  
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        console.log("Decoded Token:", decoded);
        this.userId = decoded?.userId || decoded?.id;
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }
  
  

  triggerSnapshot(): void {
    this.trigger.next(undefined); //signals Webcam to take picture
  }

  handleImage(webcamImage: WebcamImage): void {
    this.webcamImage = webcamImage;

   // Checking Image Captured or not
   //  console.log('Captured Image Base64:', this.webcamImage.imageAsBase64);
  }

  get triggerObservable(): Observable<any> {
    return this.trigger.asObservable();
  }

  uploadImage(): void {
    if (this.webcamImage && this.userId) {
      let base64Data = this.webcamImage.imageAsBase64.trim();
  
      //console.log("Captured Image Base64:", base64Data);
  
    
      if (!base64Data.startsWith("data:image")) {
        base64Data = `data:image/jpeg;base64,${base64Data}`;
        //console.warn("Base64 prefix added automatically.");
      }
  
      const imageBlob = this.dataURItoBlob(base64Data);
      const formData = new FormData();
      formData.append('image', imageBlob, 'profile.jpg');

      this.http.post(`http://localhost:3000/api/users/${this.userId}/upload`, formData)
        .subscribe(
          response => {
            console.log('✅ Upload successful', response);
          
            localStorage.setItem('hasImage', 'true');

            this.router.navigate(['/dashboard']);
          },
          error => console.error(' Upload failed', error)
        );
    } else {
      console.error("No image captured or user ID missing");
    }
  }  

  dataURItoBlob(dataURI: string): Blob {
    const byteString = atob(dataURI.split(',')[1]);
    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
  
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const uint8Array = new Uint8Array(arrayBuffer);
  
    for (let i = 0; i < byteString.length; i++) {
      uint8Array[i] = byteString.charCodeAt(i);
    }
  
    return new Blob([arrayBuffer], { type: mimeString });
  }  

}
