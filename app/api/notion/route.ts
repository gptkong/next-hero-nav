import { NextRequest, NextResponse } from "next/server";
import { NotionAPI } from "notion-client";
import { parsePageId } from "notion-utils";
import type { HomeGatewayItem } from "@/types/homegateway";

// Create a new instance for each request to avoid caching issues
function getNotionClient() {
  return new NotionAPI({
    activeUser: undefined,
    authToken: undefined,
    userTimeZone: 'Asia/Shanghai',
  });
}

// Helper function to extract text from Notion property
function extractText(propertyData: any[]): string {
  if (!propertyData || !Array.isArray(propertyData)) return "";
  const textArray = propertyData[0];
  if (Array.isArray(textArray) && textArray.length > 0) {
    return textArray[0] || "";
  }
  return "";
}

// Helper function to extract boolean from checkbox
function extractBoolean(propertyData: any[]): boolean {
  if (!propertyData || !Array.isArray(propertyData)) return false;
  const value = propertyData[0];
  if (Array.isArray(value) && value.length > 0) {
    const text = value[0]?.toLowerCase();
    return text === "true" || text === "yes" || text === "是";
  }
  return value === "Yes" || value === true || value === "TRUE" || value === "FALSE";
}

// Disable caching for this route
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const pageId = searchParams.get("pageId") || process.env.NOTION_PAGE_ID;

    if (!pageId) {
      return NextResponse.json(
        { error: "Page ID is required. Pass ?pageId=xxx or set NOTION_PAGE_ID in .env" },
        { status: 400 }
      );
    }

    // Parse and normalize the page ID
    const normalizedPageId = parsePageId(pageId);

    if (!normalizedPageId) {
      return NextResponse.json(
        { error: "Invalid page ID format" },
        { status: 400 }
      );
    }

    // Fetch the page content including database blocks
    // Create a new client instance to avoid caching
    const notion = getNotionClient();

    // Force fresh data by adding timestamp to bypass cache
    const recordMap = await notion.getPage(normalizedPageId, {
      fetchCollections: true,
      signFileUrls: false,
      chunkLimit: 100,
      chunkNumber: 0,
    });

    // Extract collection (database) data from the record map
    const collections = recordMap.collection || {};
    const collectionViews = recordMap.collection_view || {};
    const blocks = recordMap.block || {};

    // Find the collection (database) block
    let collectionId: string | null = null;
    let collectionData: any = null;

    // Search for collection_view blocks to find the database
    for (const [blockId, blockData] of Object.entries(blocks)) {
      const block = (blockData as any).value;
      if (block?.type === "collection_view" || block?.type === "collection_view_page") {
        collectionId = block.collection_id;
        break;
      }
    }

    if (collectionId && collections[collectionId]) {
      collectionData = collections[collectionId].value;
    }

    if (!collectionData) {
      return NextResponse.json(
        { error: "No database found in this page. Make sure the page contains a database." },
        { status: 404 }
      );
    }

    // Extract schema to understand the property structure
    const schema = collectionData.schema || {};

    // Map property IDs to names
    const propertyMap: Record<string, string> = {};
    for (const [propId, propData] of Object.entries(schema)) {
      propertyMap[propId] = (propData as any).name;
    }

    // Extract rows (pages in the database)
    const items: HomeGatewayItem[] = [];

    for (const [blockId, blockData] of Object.entries(blocks)) {
      const block = (blockData as any).value;

      // Only process page blocks that belong to this collection
      if (block?.type === "page" && block?.parent_id === collectionId) {
        const properties = block.properties || {};

        const item: any = {};

        // Map properties using the schema
        for (const [propId, propValue] of Object.entries(properties)) {
          const propName = propertyMap[propId];
          if (propName) {
            item[propName] = extractText(propValue as any);
          }
        }

        // Convert to HomeGatewayItem structure
        const gatewayItem: HomeGatewayItem = {
          Name: item.Name || "",
          IP: item.IP || "",
          Internet: item.Internet || "",
          localAddr: item.localAddr || "",
          BasicAuth: extractBoolean(properties[Object.keys(propertyMap).find(k => propertyMap[k] === "BasicAuth") || ""] as any),
          Status: item.Status || "",
          Virtualization: item.Virtualization || "",
          Hardware: item.Hardware || "",
        };

        items.push(gatewayItem);
      }
    }

    const response = NextResponse.json({
      success: true,
      data: items,
      count: items.length,
      timestamp: new Date().toISOString(),
    });

    // Add cache control headers to prevent caching
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');

    return response;
  } catch (error: any) {
    console.error("Notion API Error:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch data from Notion",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
