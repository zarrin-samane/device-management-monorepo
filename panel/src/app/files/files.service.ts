import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { map } from 'rxjs';
import { File as MyFile } from '@device-management/types';

@Injectable({
  providedIn: 'root',
})
export class FilesService {
  constructor(private http: HttpClient) {}

  upload(file: File, title: string, version: number) {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<MyFile>(`/files/upload/${title}/${version}`, formData).toPromise();
  }

  getFileUrl(key: string) {
    return `${environment.bucketUrl}/${key}`;
  }
}
