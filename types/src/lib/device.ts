export class Device {
  id: any;
  _id: string;

  title: string;

  serial: string;

  version?: number;

  currentVersion?: number;

  tags: string[];

  connectedAt?: Date;
}
