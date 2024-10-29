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
