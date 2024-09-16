import { Pipe, PipeTransform } from '@angular/core';

export enum ConnectionStatus {
  Null,
  Offline,
  Pending,
  Online,
}

export const connectionStatusText = {
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
    let status: ConnectionStatus;
    if (value) {
      const hDiff = (Date.now() - new Date(value).valueOf()) / 1000 / 3600;
      if (hDiff < 2) status = ConnectionStatus.Online;
      else if (hDiff < 48) status = ConnectionStatus.Pending;
      else status = ConnectionStatus.Offline;
    } else {
      status = ConnectionStatus.Null;
    }
    return text ? connectionStatusText[status] : status;
  }
}
