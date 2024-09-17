import { Pipe, PipeTransform } from '@angular/core';
import { ConnectionStatus, getDeviceStatus } from '../functions/get-device-status';

export const ConnectionStatusText = {
  [ConnectionStatus.Null]: 'غیر‌فعال',
  [ConnectionStatus.Offline]: 'آفلاین',
  [ConnectionStatus.Pending]: 'در‌انتظار',
  [ConnectionStatus.Online]: 'آنلاین',
};

@Pipe({
  name: 'connectionStatus',
  standalone: true,
})
export class ConnectionStatusPipe implements PipeTransform {
  transform(value?: Date, text?: boolean): ConnectionStatus | string {
    const status = getDeviceStatus(value);
    return text ? ConnectionStatusText[status] : status;
  }
}
