import { SSURI, SSProxy, SSScheme } from "../src/index"

describe("test SS URI generate", () => {
  it("Generate SS URI", () => {
    // ss://bf-cfb:rn23!/YE:-WI2^249T@#a@192.168.100.1:8888#example-server
    // ss://YmYtY2ZiOnJuMjMhL1lFOi1XSTJeMjQ5VEAjYUAxOTIuMTY4LjEwMC4xOjg4ODg=#example-server
    expect(SSURI.generate(SSScheme.SS, false, "192.168.100.1", 8888, "bf-cfB", "rn23!/YE:-WI2^249T@#a", "example-server")).toBe("ss://YmYtY2ZiOnJuMjMhL1lFOi1XSTJeMjQ5VEAjYUAxOTIuMTY4LjEwMC4xOjg4ODg=#example-server");
  })

  it("Generate SS URI without remark", () => {
    // ss://bf-cfb:rn23!/YE:-WI2^249T@#a@192.168.100.1:8888#example-server
    // ss://YmYtY2ZiOnJuMjMhL1lFOi1XSTJeMjQ5VEAjYUAxOTIuMTY4LjEwMC4xOjg4ODg=
    expect(SSURI.generate(SSScheme.SS, false, "192.168.100.1", 8888, "bf-cfb", "rn23!/YE:-WI2^249T@#a")).toBe("ss://YmYtY2ZiOnJuMjMhL1lFOi1XSTJeMjQ5VEAjYUAxOTIuMTY4LjEwMC4xOjg4ODg=");
  })

  it("Generate SS SIP002 URI", () => {
    // ss://YWVzLTEyOC1nY206dGVzdA==@192.168.100.1:8888#Dummy+profile+name
    expect(SSURI.generate(SSScheme.SS, true, "192.168.100.1", 8888, "AES-128-GCM", "test", "Dummy+profile+name")).toBe("ss://YWVzLTEyOC1nY206dGVzdA==@192.168.100.1:8888#Dummy+profile+name");
  })

  it("Generate SS SIP002 URI withour remark", () => {
    // ss://YWVzLTEyOC1nY206dGVzdA==@192.168.100.1:8888#Dummy+profile+name
    expect(SSURI.generate(SSScheme.SS, true, "192.168.100.1", 8888, "aes-128-gcm", "test")).toBe("ss://YWVzLTEyOC1nY206dGVzdA==@192.168.100.1:8888");
  })
})

describe("test SSR URI generate", () => {

  it("Generate SSR URI with no additional info", () => {
    // ssr://MTkyLjE2OC4xMDAuMTo4ODg4Om9yaWdpbjpiZi1jZmI6cGxhaW46ZEdWemRB
    expect(SSURI.generate(SSScheme.SSR, false, "192.168.100.1", 8888, "bf-cfb", "test")).toBe("ssr://MTkyLjE2OC4xMDAuMTo4ODg4Om9yaWdpbjpiZi1jZmI6cGxhaW46ZEdWemRB");
  })

  it("Generate SSR URI with (protocol, obfs)", () => {
    // ssr://c2hhZG93c29ja3Mub3JnOjQ0MzphdXRoX3NoYTFfdjQ6YWVzLTI1Ni1jZmI6dGxzMS4yX3RpY2tldF9hdXRoOllXUnViek5lSmpFek1ERkFKQ1VxS0Rv
    expect(SSURI.generate(SSScheme.SSR, false, "shadowsocks.org", 443, "aes-256-cfb", "adno3^&1301@$%*(:", undefined, "auth_sha1_v4", undefined, "tls1.2_ticket_auth")).toBe("ssr://c2hhZG93c29ja3Mub3JnOjQ0MzphdXRoX3NoYTFfdjQ6YWVzLTI1Ni1jZmI6dGxzMS4yX3RpY2tldF9hdXRoOllXUnViek5lSmpFek1ERkFKQ1VxS0Rv");
  })

  it("Generate SSR URI with all info", () => {
    // ssr://MTI3LjAuMC4xOjEyMzQ6YXV0aF9hZXMxMjhfbWQ1OmFlcy0xMjgtY2ZiOnRsczEuMl90aWNrZXRfYXV0aDpZV0ZoWW1KaS8_b2Jmc3BhcmFtPVluSmxZV3QzWVRFeExtMXZaUSZyZW1hcmtzPTVyV0w2Sy1WNUxpdDVwYUg
    expect(SSURI.generate(SSScheme.SSR, false, "127.0.0.1", 1234, "aes-128-cfb", "aaabbb", "测试中文", "auth_aes128_md5", undefined, "tls1.2_ticket_auth", "breakwa11.moe")).toBe("ssr://MTI3LjAuMC4xOjEyMzQ6YXV0aF9hZXMxMjhfbWQ1OmFlcy0xMjgtY2ZiOnRsczEuMl90aWNrZXRfYXV0aDpZV0ZoWW1KaS8_b2Jmc3BhcmFtPVluSmxZV3QzWVRFeExtMXZaUSZyZW1hcmtzPTVyV0w2Sy1WNUxpdDVwYUg");
  })
})

describe("test SS URI parse", () => {
  it("Proxy uri", () => {
    let uri = "sS://YmYtY2ZiOnJuMjMhL1lFOi1XSTJeMjQ5VEAjYUAxOTIuMTY4LjEwMC4xOjg4ODg#example-server"
    let proxies = SSURI.parse(uri);
    let expected = new SSProxy();
    expected.scheme = SSScheme.SS;
    expected.host = "192.168.100.1";
    expected.port = 8888;
    expected.authscheme = "bf-cfb";
    expected.password = "rn23!/YE:-WI2^249T@#a";
    expected.remark = "example-server";
    expect(proxies.length).toBe(1);
    expect(proxies[0]).toEqual(expected);
  })

  it("Proxy uri (capitalized)", () => {
    let uri = "sS://YmYtQ0ZCOnJuMjMhL1lFOi1XSTJeMjQ5VEAjYUAxOTIuMTY4LjEwMC4xOjg4ODg=#example-server"
    let proxies = SSURI.parse(uri);
    let expected = new SSProxy();
    expected.scheme = SSScheme.SS;
    expected.host = "192.168.100.1";
    expected.port = 8888;
    expected.authscheme = "bf-cfb";
    expected.password = "rn23!/YE:-WI2^249T@#a";
    expected.remark = "example-server";
    expect(proxies.length).toBe(1);
    expect(proxies[0]).toEqual(expected);
  })

  it("Proxy uri", () => {
    let uri = "ss://YWVzLTI1Ni1jZmI6Z291bGlndW9qaWFzaGVuZ3NpeWlANDUuNjIuOTcuODM6ODA=#Direct+Route"
    let proxies = SSURI.parse(uri);
    expect(proxies.length).toBe(1);
    expect(proxies[0].remark).toEqual("Direct+Route");
  })

  it("Proxy wrong uris", () => {
    let uris = [
      "ss://YWVzLTI1Ni1jZmJAc2hhZG93c29ja3Mub3JnOjQ0Mw",
      "ss://YWVzLTI1Ni1jZmItYXV0aDpybjIzIS9ZRTotV0kyXjI0OVRAI2FAc2hhZG93c29ja3Mub3Jn"
    ]
    for (let uri of uris) {
      let proxies = SSURI.parse(uri);
      expect(proxies.length).toBe(0);
    }
  })
})

describe("test SSR URI parse", () => {
  it("Proxy uri", () => {
    let uri = "ssr://c2hhZG93c29ja3Mub3JnOjQ0MzphdXRoX3NoYTFfdjQ6YWVzLTI1Ni1jZmI6dGxzMS4yX3RpY2tldF9hdXRoOllXUnViek5lSmpFek1ERkFKQ1VxS0RvPQ=="
    let proxies = SSURI.parse(uri);
    let expected = new SSProxy();
    expected.scheme = SSScheme.SSR;
    expected.host = "shadowsocks.org";
    expected.port = 443;
    expected.authscheme = "aes-256-cfb";
    expected.password = "adno3^&1301@$%*(:";
    expected.protocol = "auth_sha1_v4";
    expected.obfs = "tls1.2_ticket_auth";
    expect(proxies.length).toBe(1);
    expect(proxies[0]).toEqual(expected);
  })

  it("SSR URI with no additional info (capitalized)", () => {
    let uri = "ssr://MTkyLjE2OC4xMDAuMTo4ODg4Ok9SSUdJTjpiRi1DRkI6UExBSU46ZEdWemRB"
    let proxies = SSURI.parse(uri);
    let expected = new SSProxy();
    expected.scheme = SSScheme.SSR;
    expected.host = "192.168.100.1";
    expected.port = 8888;
    expected.authscheme = "bf-cfb";
    expected.password = "test";
    expected.protocol = "origin";
    expected.obfs = "plain";
    expect(proxies.length).toBe(1);
    expect(proxies[0]).toEqual(expected);
  })

  it("Proxy uri", () => {
    let uri = "ssr://MTI3LjAuMC4xOjEyMzQ6YXV0aF9hZXMxMjhfbWQ1OmFlcy0xMjgtY2ZiOnRsczEuMl90aWNrZXRfYXV0aDpZV0ZoWW1KaS8_b2Jmc3BhcmFtPVluSmxZV3QzWVRFeExtMXZaUSZyZW1hcmtzPTVyV0w2Sy1WNUxpdDVwYUg="
    let proxies = SSURI.parse(uri);
    let expected = new SSProxy();
    expected.scheme = SSScheme.SSR;
    expected.host = "127.0.0.1";
    expected.port = 1234;
    expected.authscheme = "aes-128-cfb";
    expected.password = "aaabbb";
    expected.protocol = "auth_aes128_md5";
    expected.obfs = "tls1.2_ticket_auth";
    expected.obfsParam = "breakwa11.moe";
    expected.remark = "测试中文";
    expect(proxies.length).toBe(1);
    expect(proxies[0]).toEqual(expected);
  })

  it("Proxy uri", () => {
    let uri = "ssr://MTAuMjkuMjEuMjo4ODM4OmF1dGhfc2hhMV92NDphZXMtMjU2LWNmYjp0bHMxLjJfdGlja2V0X2F1dGg6WVdSdWJ6TmVKakV6TURGQUpDVXFLRG89P29iZnNQYXJhbT1ZbUZwWkhVdVkyOXRMR2R2YjJkc1pTNWpiMjA9JnJlbWFya3M9WlhoaGJYQnNaUzF6WlhKMlpYST0mcHJvdG9wYXJhbT1NVEl6T25kaGJHVnA="
    let proxies = SSURI.parse(uri);
    let expected = new SSProxy();
    expected.scheme = SSScheme.SSR;
    expected.host = "10.29.21.2";
    expected.port = 8838;
    expected.authscheme = "aes-256-cfb";
    expected.password = "adno3^&1301@$%*(:";
    expected.protocol = "auth_sha1_v4";
    expected.protocolParam = "123:walei";
    expected.obfs = "tls1.2_ticket_auth";
    expected.obfsParam = "baidu.com,google.com";
    expected.remark = "example-server";
    expect(proxies.length).toBe(1);
    expect(proxies[0]).toEqual(expected);
  })

  it("Proxy wrong uris", () => {
    let uris = [
      "ssr://YWVzLTI1Ni1jZmJAc2hhZG93c29ja3Mub3JnOjQ0Mw",
      "ssr://c2hhZG93c29ja3Mub3JnOjQ0MzphdXRoX3NoYTFfdjRhZXMtMjU2LWNmYjp0bHMxLjJfdGlja2V0X2F1dGg6WVdSdWJ6TmVKakV6TURGQUpDVXFLRG89"
    ]
    for (let uri of uris) {
      let proxies = SSURI.parse(uri);
      expect(proxies.length).toBe(0);
    }
  })
})  

describe("test mutiple", () => {
  let ssrURIs = [
    "ssr://c2hhZG93c29ja3Mub3JnOjQ0MzphdXRoX3NoYTFfdjQ6YWVzLTI1Ni1jZmI6dGxzMS4yX3RpY2tldF9hdXRoOllXUnViek5lSmpFek1ERkFKQ1VxS0RvPQ==",
    "ssr://MTI3LjAuMC4xOjEyMzQ6YXV0aF9hZXMxMjhfbWQ1OmFlcy0xMjgtY2ZiOnRsczEuMl90aWNrZXRfYXV0aDpZV0ZoWW1KaS8_b2Jmc3BhcmFtPVluSmxZV3QzWVRFeExtMXZaUSZyZW1hcmtzPTVyV0w2Sy1WNUxpdDVwYUg",
  ];
  let ssURIs = [
    "ss://YmYtY2ZiOnJuMjMhL1lFOi1XSTJeMjQ5VEAjYUAxOTIuMTY4LjEwMC4xOjg4ODg=#example-server",
    "ss://YmYtY2ZiOnJuMjMhL1lFOi1XSTJeMjQ5VEAjYUAxOTIuMTY4LjEwMC4xOjg4ODg=",
    "ss://YWVzLTEyOC1nY206dGVzdA==@192.168.100.1:8888#Dummy+profile+name",
    "ss://YWVzLTEyOC1nY206dGVzdA==@192.168.100.1:8888",
  ];
  let separators = [" ", "\n", "\r\n", "|", " | "];
  
  it("Multiple SSR", () => {
    for (let separator of separators) {
      let uri = ssrURIs.join(separator);
      let proxies = SSURI.parse(uri);
      expect(proxies.length).toBe(2);  
    }
  })

  it("Multiple SS", () => {
    for (let separator of separators) {
      let uri = ssURIs.join(separator);
      let proxies = SSURI.parse(uri);
      expect(proxies.length).toBe(4);  
    }
  })

  it("Multiple SS and SSR", () => {
    for (let separator of separators) {
      let uri = ssrURIs.concat(ssURIs).join(separator);
      let proxies = SSURI.parse(uri);
      expect(proxies.length).toBe(6);  
    }
  })
})