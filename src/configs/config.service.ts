import * as dotenv from 'dotenv';
import * as fs from 'fs';

export class ConfigService {
  private readonly envConfig: { [key: string]: string };

  constructor(filePath: string) {
    this.envConfig = dotenv.parse(fs.readFileSync(filePath));
  }

  get env(): string {
    return this.envConfig.NODE_ENV;
  }

  get omniVersion(): string {
    return this.envConfig.npm_package_version;
  }

  get projectId(): string {
    return this.envConfig.PROJECT_ID;
  }

  get pathBaseMs(): string {
    return this.envConfig.PATH_BASE_MS;
  }

  get port(): number {
    return Number(this.envConfig.NODE_PORT);
  }

  get apiConnectUrl(): string {
    return this.envConfig.API_CONNECT_BASE_URL;
  }

  get apiConnectClientId(): string {
    return this.envConfig.API_CONNECT_CLIENT_ID;
  }

  get apiConnectClientSecret(): string {
    return this.envConfig.API_CONNECT_CLIENT_SECRET;
  }

  get auditLogUrl(): string {
    return `${this.envConfig.AUDIT_LOG_URL}${this.envConfig.ELASTIC_SEARCH_INDEX_NAME}/`;
  }

  get elasticSearchUrl(): string {
    return this.envConfig.ELASTIC_SEARCH_URL;
  }

  get elasticSearchIndexName(): string {
    return this.envConfig.ELASTIC_SEARCH_INDEX_NAME;
  }

  get elasticSearchToken(): string {
    return this.envConfig.ELASTIC_SEARCH_TOKEN;
  }

  get omniProfitabilityContributionsUrl(): string {
    return this.envConfig.OMNI_PROFITABILITY_CONTRIBUTIONS_BASE_URL;
  }
}
