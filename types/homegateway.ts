export interface HomeGatewayItem {
  Name: string;
  IP: string;
  Internet: string;
  localAddr: string;
  BasicAuth: boolean;
  Status: string;
  Virtualization: string;
  Hardware: string;
}

export interface NotionDatabaseResponse {
  results: Array<{
    id: string;
    properties: {
      Name: { title: Array<{ plain_text: string }> };
      IP: { rich_text: Array<{ plain_text: string }> };
      Internet: { url: string } | { rich_text: Array<{ plain_text: string }> };
      localAddr: { url: string } | { rich_text: Array<{ plain_text: string }> };
      BasicAuth: { checkbox: boolean };
      Status: { select: { name: string } } | { rich_text: Array<{ plain_text: string }> };
      Virtualization: { select: { name: string } } | { rich_text: Array<{ plain_text: string }> };
      Hardware: { select: { name: string } } | { rich_text: Array<{ plain_text: string }> };
    };
  }>;
}
