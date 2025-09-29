import { Injectable } from '@angular/core';
import { Device } from '@device-management/types';

@Injectable({
  providedIn: 'root',
})
export class CsvService {
  async processDeviceCsvFile(file: File): Promise<Partial<Device>[]> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const text = e.target?.result as string;
          const lines = text.split('\n');
          
          // Remove empty lines
          const nonEmptyLines = lines.filter(line => line.trim().length > 0);
          if (nonEmptyLines.length < 2) {
            throw new Error('CSV file must contain a header row and at least one data row');
          }
          
          const devices: Partial<Device>[] = [];
          
          // Process data rows, skip header row
          for (let i = 1; i < nonEmptyLines.length; i++) {
            const values = nonEmptyLines[i].split(',').map(v => v.trim());
            if (values.length < 1) {
              continue; // Skip empty rows
            }
            
            const device: Partial<Device> = {
              serial: values[0], // 1st column as serial
              title: values[1] || values[0], // 2nd column as title, fallback to serial if empty
              tags: values[2] ? [values[2]] : [], // 3rd column as tag
            };
            
            // Validate required fields
            if (!device.serial) {
              continue; // Skip rows without serial
            }
            
            devices.push(device);
          }
          
          resolve(devices);
        } catch (error) {
          reject(error);
        }
      };
      
      reader.onerror = () => {
        reject(new Error('Error reading file'));
      };
      
      reader.readAsText(file);
    });
  }
} 