export interface IpInfo {
  ip: string;
  city: string;
  country_name: string;
  org: string;
  region: string;
  latitude: string;
  longitude: string;
}

export interface ScanHistory {
  domain: string;
  ip: string;
  timestamp: string;
  result: IpInfo;
}