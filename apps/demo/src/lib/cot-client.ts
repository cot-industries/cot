/**
 * Cot API Client
 * 
 * Used by demo app (and any customer app) to interact with Cot platform.
 * Consumes REST API with API key authentication.
 */

export class CotClient {
  private baseUrl: string;
  private apiKey: string;

  constructor(baseUrl: string, apiKey: string) {
    this.baseUrl = baseUrl;
    this.apiKey = apiKey;
  }

  /**
   * List records for an entity
   */
  async listRecords(
    entity: string,
    options?: { limit?: number; offset?: number }
  ): Promise<{
    data: Record<string, any>[];
    meta: { total: number; limit: number; offset: number };
  }> {
    const params = new URLSearchParams();
    if (options?.limit) params.set("limit", options.limit.toString());
    if (options?.offset) params.set("offset", options.offset.toString());

    const response = await fetch(`${this.baseUrl}/data/${entity}?${params}`, {
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
      },
      next: { revalidate: 0 }, // Always fresh data
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch ${entity}: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Get single record by ID
   */
  async getRecord(entity: string, id: string): Promise<{ data: Record<string, any> }> {
    const response = await fetch(`${this.baseUrl}/data/${entity}/${id}`, {
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
      },
      next: { revalidate: 0 },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch ${entity}/${id}: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Create a new record
   */
  async createRecord(entity: string, data: Record<string, any>): Promise<{ data: Record<string, any> }> {
    const response = await fetch(`${this.baseUrl}/data/${entity}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to create ${entity}: ${error}`);
    }

    return response.json();
  }

  /**
   * Update a record
   */
  async updateRecord(
    entity: string,
    id: string,
    data: Record<string, any>
  ): Promise<{ data: Record<string, any> }> {
    const response = await fetch(`${this.baseUrl}/data/${entity}/${id}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to update ${entity}/${id}: ${error}`);
    }

    return response.json();
  }

  /**
   * Delete a record
   */
  async deleteRecord(entity: string, id: string): Promise<{ success: boolean }> {
    const response = await fetch(`${this.baseUrl}/data/${entity}/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
      },
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to delete ${entity}/${id}: ${error}`);
    }

    return response.json();
  }
}

/**
 * Singleton instance for demo app
 * In production, each customer would have their own API key
 */
export const cotClient = new CotClient(
  process.env.NEXT_PUBLIC_COT_API_URL || "http://localhost:3000/api/v1",
  process.env.COT_API_KEY || ""
);
