import { Pipe, PipeTransform } from '@angular/core';
import { environment } from '../../../environments/environment';

@Pipe({
  name: 'fileUrl',
  standalone: true,
})
export class FileUrlPipe implements PipeTransform {
  transform(value: string): unknown {
    return `${environment.bucketUrl}/${value}`;
  }
}
