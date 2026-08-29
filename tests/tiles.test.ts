import { describe, it, expect, vi } from "vitest";
import { NextRequest } from "next/server";
import { GET } from "../src/app/api/tiles/[z]/[x]/[y]/route";
import { client } from "../src/db";

describe("Vector Tiles Streaming API (/api/tiles/[z]/[x]/[y])", () => {
  it("mengembalikan status 200, header protobuf & cache-control untuk tile Semarang (z=11, x=1652, y=1063)", async () => {
    const mockMvt = Buffer.from([0x1a, 0x05, 0x74, 0x65, 0x73, 0x74]);
    const spy = vi.spyOn(client, "unsafe").mockResolvedValueOnce([{ mvt: mockMvt }] as any);

    const request = new NextRequest("http://localhost:3000/api/tiles/11/1652/1063");
    const params = Promise.resolve({ z: "11", x: "1652", y: "1063" });

    const response = await GET(request, { params });

    expect(response.status).toBe(200);
    expect(response.headers.get("Content-Type")).toBe("application/x-protobuf");
    expect(response.headers.get("Cache-Control")).toContain("public, max-age=300");

    const buffer = await response.arrayBuffer();
    expect(buffer.byteLength).toBeGreaterThan(0);
    spy.mockRestore();
  });

  it("mengembalikan status 200 untuk zoom global z=0, x=0, y=0", async () => {
    const mockMvt = Buffer.from([0x1a, 0x05, 0x74, 0x65, 0x73, 0x74]);
    const spy = vi.spyOn(client, "unsafe").mockResolvedValueOnce([{ mvt: mockMvt }] as any);

    const request = new NextRequest("http://localhost:3000/api/tiles/0/0/0");
    const params = Promise.resolve({ z: "0", x: "0", y: "0" });

    const response = await GET(request, { params });

    expect(response.status).toBe(200);
    expect(response.headers.get("Content-Type")).toBe("application/x-protobuf");
    const buffer = await response.arrayBuffer();
    expect(buffer.byteLength).toBeGreaterThan(0);
    spy.mockRestore();
  });

  it("mengembalikan status 204 No Content untuk tile kosong tanpa geometri (z=11, x=0, y=0)", async () => {
    const spy = vi.spyOn(client, "unsafe").mockResolvedValueOnce([{ mvt: null }] as any);

    const request = new NextRequest("http://localhost:3000/api/tiles/11/0/0");
    const params = Promise.resolve({ z: "11", x: "0", y: "0" });

    const response = await GET(request, { params });

    expect(response.status).toBe(204);
    spy.mockRestore();
  });

  it("mengembalikan status 400 Bad Request jika koordinat tile bukan angka", async () => {
    const request = new NextRequest("http://localhost:3000/api/tiles/abc/def/ghi");
    const params = Promise.resolve({ z: "abc", x: "def", y: "ghi" });

    const response = await GET(request, { params });

    expect(response.status).toBe(400);
    const text = await response.text();
    expect(text).toBe("Invalid tile coordinates");
  });

  it("mengembalikan status 400 Bad Request jika zoom negatif", async () => {
    const request = new NextRequest("http://localhost:3000/api/tiles/-1/0/0");
    const params = Promise.resolve({ z: "-1", x: "0", y: "0" });

    const response = await GET(request, { params });

    expect(response.status).toBe(400);
  });

  it("mengembalikan status 400 Bad Request jika koordinat tile X atau Y melebihi batas 2^zoom", async () => {
    const request = new NextRequest("http://localhost:3000/api/tiles/2/10/10");
    const params = Promise.resolve({ z: "2", x: "10", y: "10" });

    const response = await GET(request, { params });

    expect(response.status).toBe(400);
  });

  it("mengembalikan status 500 jika query database mengalami error", async () => {
    const spy = vi.spyOn(client, "unsafe").mockRejectedValueOnce(new Error("DB connection lost"));
    const request = new NextRequest("http://localhost:3000/api/tiles/11/1652/1063");
    const params = Promise.resolve({ z: "11", x: "1652", y: "1063" });

    const response = await GET(request, { params });

    expect(response.status).toBe(500);
    const text = await response.text();
    expect(text).toBe("Internal Server Error");

    spy.mockRestore();
  });
});
