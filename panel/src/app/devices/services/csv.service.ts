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
          
          // Remove empty lines and get header
          const nonEmptyLines = lines.filter(line => line.trim().length > 0);
          if (nonEmptyLines.length < 2) {
            throw new Error('CSV file must contain a header row and at least one data row');
          }
          
          const header = nonEmptyLines[0].split(',').map(h => h.trim().toLowerCase());
          const requiredColumns = ['serial'];
          const missingColumns = requiredColumns.filter(col => !header.includes(col));
          
          if (missingColumns.length > 0) {
            throw new Error(`Missing required columns: ${missingColumns.join(', ')}`);
          }
          
          const devices: Partial<Device>[] = [];
          
          // Process data rows
          for (let i = 1; i < nonEmptyLines.length; i++) {
            const values = nonEmptyLines[i].split(',').map(v => v.trim());
            if (values.length !== header.length) {
              continue; // Skip malformed rows
            }
            
            const device: Partial<Device> = {};
            header.forEach((column, index) => {
              const value = values[index];
              switch (column) {
                case 'serial':
                  device.serial = value;
                  break;
                case 'title':
                  device.title = value;
                  break;
                case 'tag':
                  if (value) {
                    device.tags = [value];
                  }
                  break;
              }
            });
            
            // Validate required fields
            if (!device.serial) {
              continue; // Skip rows without serial
            }
            
            // Use serial as title if title is not provided
            if (!device.title) {
              device.title = device.serial;
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