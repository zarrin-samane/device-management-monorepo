export class Device {
  id: any;
  _id: string;

  title: string;

  serial: string;

  version?: number;

  currentVersion?: number;

  tags: string[];

  details?: { [key: string]: string | number };

  connectedAt?: Date;
}

export class DeviceFilterDto {
  query?: string;
  tag?: string;
  nullConnectionAt?: boolean;
  minConnectionAt?: Date;
  maxConnectionAt?: Date;
  page?: number;
  limit?: number;
}
