const portfolioFolder = "orko-portfolio";
const portfolioTag = "orko_portfolio";

export type CloudinaryResourceType = "image" | "video" | "raw";

export type CloudinaryAsset = {
  assetId: string;
  publicId: string;
  resourceType: CloudinaryResourceType;
  format: string;
  secureUrl: string;
  bytes: number;
  width: number | null;
  height: number | null;
  duration: number | null;
  createdAt: string;
};

type CloudinaryCredentials = {
  cloudName: string;
  apiKey: string;
  apiSecret: string;
};

function credentials(): CloudinaryCredentials {
  return {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME?.trim() ?? "",
    apiKey: process.env.CLOUDINARY_API_KEY?.trim() ?? "",
    apiSecret: process.env.CLOUDINARY_API_SECRET ?? "",
  };
}

export function cloudinaryStatus() {
  const value = credentials();
  const missing = [
    !value.cloudName && "CLOUDINARY_CLOUD_NAME",
    !value.apiKey && "CLOUDINARY_API_KEY",
    !value.apiSecret && "CLOUDINARY_API_SECRET",
  ].filter(Boolean) as string[];
  return { configured: missing.length === 0, missing };
}

function requireCredentials() {
  const value = credentials();
  if (!value.cloudName || !value.apiKey || !value.apiSecret) throw new Error("CLOUDINARY_NOT_CONFIGURED");
  if (!/^[a-z0-9_-]+$/i.test(value.cloudName)) throw new Error("CLOUDINARY_INVALID_CLOUD_NAME");
  return value;
}

async function sha1(value: string) {
  const digest = await crypto.subtle.digest("SHA-1", new TextEncoder().encode(value));
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

async function signature(params: Record<string, string>, secret: string) {
  const source = Object.entries(params).sort(([left], [right]) => left.localeCompare(right)).map(([key, value]) => `${key}=${value}`).join("&");
  return sha1(`${source}${secret}`);
}

export async function createCloudinaryUploadSignature() {
  const { cloudName, apiKey, apiSecret } = requireCredentials();
  const params = {
    folder: portfolioFolder,
    overwrite: "false",
    tags: portfolioTag,
    timestamp: String(Math.floor(Date.now() / 1000)),
    unique_filename: "true",
    use_filename: "true",
  };
  return {
    cloudName,
    apiKey,
    params,
    signature: await signature(params, apiSecret),
  };
}

type CloudinaryListResponse = {
  resources?: Array<{
    asset_id?: string;
    public_id?: string;
    resource_type?: string;
    format?: string;
    secure_url?: string;
    bytes?: number;
    width?: number;
    height?: number;
    duration?: number;
    created_at?: string;
  }>;
};

async function listType(resourceType: CloudinaryResourceType, auth: string, cloudName: string) {
  const endpoint = `https://api.cloudinary.com/v1_1/${encodeURIComponent(cloudName)}/resources/${resourceType}/tags/${portfolioTag}?max_results=100`;
  const response = await fetch(endpoint, { headers: { Authorization: `Basic ${auth}`, Accept: "application/json" }, cache: "no-store" });
  if (!response.ok) throw new Error("CLOUDINARY_LIST_FAILED");
  const payload = await response.json() as CloudinaryListResponse;
  return (payload.resources ?? []).flatMap((resource): CloudinaryAsset[] => {
    if (!resource.asset_id || !resource.public_id || !resource.secure_url) return [];
    return [{
      assetId: resource.asset_id,
      publicId: resource.public_id,
      resourceType,
      format: resource.format ?? "file",
      secureUrl: resource.secure_url,
      bytes: resource.bytes ?? 0,
      width: resource.width ?? null,
      height: resource.height ?? null,
      duration: resource.duration ?? null,
      createdAt: resource.created_at ?? "",
    }];
  });
}

export async function listCloudinaryAssets() {
  const { cloudName, apiKey, apiSecret } = requireCredentials();
  const auth = btoa(`${apiKey}:${apiSecret}`);
  const groups = await Promise.all((["image", "video", "raw"] as const).map((type) => listType(type, auth, cloudName)));
  return groups.flat().sort((left, right) => right.createdAt.localeCompare(left.createdAt));
}

export async function deleteCloudinaryAsset(publicId: string, resourceType: CloudinaryResourceType) {
  const { cloudName, apiKey, apiSecret } = requireCredentials();
  const params = {
    invalidate: "true",
    public_id: publicId,
    timestamp: String(Math.floor(Date.now() / 1000)),
    type: "upload",
  };
  const form = new FormData();
  for (const [key, value] of Object.entries(params)) form.set(key, value);
  form.set("api_key", apiKey);
  form.set("signature", await signature(params, apiSecret));
  const response = await fetch(`https://api.cloudinary.com/v1_1/${encodeURIComponent(cloudName)}/${resourceType}/destroy`, { method: "POST", body: form });
  if (!response.ok) throw new Error("CLOUDINARY_DELETE_FAILED");
  const result = await response.json() as { result?: string };
  return result.result === "ok" || result.result === "not found";
}
