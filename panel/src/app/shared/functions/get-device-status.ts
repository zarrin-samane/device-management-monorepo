export enum ConnectionStatus {
  Null,
  Offline,
  Pending,
  Online,
}

export function getDeviceStatus(date?: Date): ConnectionStatus {
  let status: ConnectionStatus;
  if (date) {
    const hDiff = (Date.now() - new Date(date).valueOf()) / 1000 / 3600;
    if (hDiff < 2) status = ConnectionStatus.Online;
    else if (hDiff < 48) status = ConnectionStatus.Pending;
    else status = ConnectionStatus.Offline;
  } else {
    status = ConnectionStatus.Null;
  }
  return status;
}
