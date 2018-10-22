import { ProxyURI, Proxy, ProxyScheme } from "../src/index"

describe("test SS URI generate", () => {
  it("Generate SS URI", () => {
    // ss://bf-cfb:rn23!/YE:-WI2^249T@#a@192.168.100.1:8888#example-server
    // ss://YmYtY2ZiOnJuMjMhL1lFOi1XSTJeMjQ5VEAjYUAxOTIuMTY4LjEwMC4xOjg4ODg=#example-server
    expect(ProxyURI.generate(ProxyScheme.SS, "192.168.100.1", 8888, "bf-cfB", null, "rn23!/YE:-WI2^249T@#a", null, null, null, null, "example-server", false)).toBe("ss://YmYtY2ZiOnJuMjMhL1lFOi1XSTJeMjQ5VEAjYUAxOTIuMTY4LjEwMC4xOjg4ODg=#example-server");
  })

  it("Generate SS URI without remark", () => {
    // ss://bf-cfb:rn23!/YE:-WI2^249T@#a@192.168.100.1:8888#example-server
    // ss://YmYtY2ZiOnJuMjMhL1lFOi1XSTJeMjQ5VEAjYUAxOTIuMTY4LjEwMC4xOjg4ODg=
    expect(ProxyURI.generate(ProxyScheme.SS, "192.168.100.1", 8888, "bf-cfb", null, "rn23!/YE:-WI2^249T@#a", null, null, null, null, null, false)).toBe("ss://YmYtY2ZiOnJuMjMhL1lFOi1XSTJeMjQ5VEAjYUAxOTIuMTY4LjEwMC4xOjg4ODg=");
  })

  it("Generate SS SIP002 URI", () => {
    // ss://YWVzLTEyOC1nY206dGVzdA==@192.168.100.1:8888#Dummy+profile+name
    expect(ProxyURI.generate(ProxyScheme.SS, "192.168.100.1", 8888, "AES-128-GCM", null, "test", null, null, null, null, "Dummy+profile+name", true)).toBe("ss://YWVzLTEyOC1nY206dGVzdA==@192.168.100.1:8888#Dummy+profile+name");
  })

  it("Generate SS SIP002 URI withour remark", () => {
    // ss://YWVzLTEyOC1nY206dGVzdA==@192.168.100.1:8888#Dummy+profile+name
    expect(ProxyURI.generate(ProxyScheme.SS, "192.168.100.1", 8888, "aes-128-gcm", null, "test", null, null, null, null, null, true)).toBe("ss://YWVzLTEyOC1nY206dGVzdA==@192.168.100.1:8888");
  })
})

describe("test SSR URI generate", () => {

  it("Generate SSR URI with no additional info", () => {
    // ssr://MTkyLjE2OC4xMDAuMTo4ODg4Om9yaWdpbjpiZi1jZmI6cGxhaW46ZEdWemRB
    expect(ProxyURI.generate(ProxyScheme.SSR, "192.168.100.1", 8888, "bf-cfb", null, "test", null, null, null, null, null, false)).toBe("ssr://MTkyLjE2OC4xMDAuMTo4ODg4Om9yaWdpbjpiZi1jZmI6cGxhaW46ZEdWemRB");
  })

  it("Generate SSR URI with (protocol, obfs)", () => {
    // ssr://c2hhZG93c29ja3Mub3JnOjQ0MzphdXRoX3NoYTFfdjQ6YWVzLTI1Ni1jZmI6dGxzMS4yX3RpY2tldF9hdXRoOllXUnViek5lSmpFek1ERkFKQ1VxS0Rv
    expect(ProxyURI.generate(ProxyScheme.SSR, "shadowsocks.org", 443, "aes-256-cfb", null, "adno3^&1301@$%*(:", "auth_sha1_v4", null, "tls1.2_ticket_auth", null, null, false)).toBe("ssr://c2hhZG93c29ja3Mub3JnOjQ0MzphdXRoX3NoYTFfdjQ6YWVzLTI1Ni1jZmI6dGxzMS4yX3RpY2tldF9hdXRoOllXUnViek5lSmpFek1ERkFKQ1VxS0Rv");
  })

  it("Generate SSR URI with all info", () => {
    // ssr://MTI3LjAuMC4xOjEyMzQ6YXV0aF9hZXMxMjhfbWQ1OmFlcy0xMjgtY2ZiOnRsczEuMl90aWNrZXRfYXV0aDpZV0ZoWW1KaS8_b2Jmc3BhcmFtPVluSmxZV3QzWVRFeExtMXZaUSZyZW1hcmtzPTVyV0w2Sy1WNUxpdDVwYUg
    expect(ProxyURI.generate(ProxyScheme.SSR, "127.0.0.1", 1234, "aes-128-cfb", null, "aaabbb", "auth_aes128_md5", undefined, "tls1.2_ticket_auth", "breakwa11.moe", "测试中文", false)).toBe("ssr://MTI3LjAuMC4xOjEyMzQ6YXV0aF9hZXMxMjhfbWQ1OmFlcy0xMjgtY2ZiOnRsczEuMl90aWNrZXRfYXV0aDpZV0ZoWW1KaS8_b2Jmc3BhcmFtPVluSmxZV3QzWVRFeExtMXZaUSZyZW1hcmtzPTVyV0w2Sy1WNUxpdDVwYUg");
  })
})

describe("test HTTP URI generate", () => {
  it("Generate HTTP URI with no additional info", () => {
    // http://192.168.100.1:8848
    expect(ProxyURI.generate(ProxyScheme.HTTP, "192.168.100.1", 8848, null, null, null, null, null, null, null, "Hello", false)).toBe("http://192.168.100.1:8848?remarks=Hello");
  })

  it("Generate HTTPS URI with plain credential", () => {
    // https://user:pass@proxy.example.com:8848
    expect(ProxyURI.generate(ProxyScheme.HTTPS, "proxy.example.com", 8848, null, "user", "pass", null, null, null, null, null, false)).toBe("https://user:pass@proxy.example.com:8848");
  })

  it("Generate HTTPS URI with url encoded credential", () => {
    // https://user%40%2f:pa%3ass@proxy.example.com:8848
    expect(ProxyURI.generate(ProxyScheme.HTTPS, "proxy.example.com", 8848, null, "user@/", "pa:ss", null, null, null, null, "🇯🇵日本", false)).toBe("https://user%40%2F:pa%3Ass@proxy.example.com:8848?remarks=%F0%9F%87%AF%F0%9F%87%B5%E6%97%A5%E6%9C%AC");
  })
});

describe("test SS URI parse", () => {
  it("Proxy uri", () => {
    let uri = "sS://YmYtY2ZiOnJuMjMhL1lFOi1XSTJeMjQ5VEAjYUAxOTIuMTY4LjEwMC4xOjg4ODg#example-server"
    let proxies = ProxyURI.parse(uri);
    let expected = new Proxy();
    expected.scheme = ProxyScheme.SS;
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
    let proxies = ProxyURI.parse(uri);
    let expected = new Proxy();
    expected.scheme = ProxyScheme.SS;
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
    let proxies = ProxyURI.parse(uri);
    expect(proxies.length).toBe(1);
    expect(proxies[0].remark).toEqual("Direct+Route");
  })

  it("Proxy wrong uris", () => {
    let uris = [
      "ss://YWVzLTI1Ni1jZmJAc2hhZG93c29ja3Mub3JnOjQ0Mw",
      "ss://YWVzLTI1Ni1jZmItYXV0aDpybjIzIS9ZRTotV0kyXjI0OVRAI2FAc2hhZG93c29ja3Mub3Jn"
    ]
    for (let uri of uris) {
      let proxies = ProxyURI.parse(uri);
      expect(proxies.length).toBe(0);
    }
  })
})

describe("test SSR URI parse", () => {
  it("Proxy uri", () => {
    let uri = "ssr://c2hhZG93c29ja3Mub3JnOjQ0MzphdXRoX3NoYTFfdjQ6YWVzLTI1Ni1jZmI6dGxzMS4yX3RpY2tldF9hdXRoOllXUnViek5lSmpFek1ERkFKQ1VxS0RvPQ=="
    let proxies = ProxyURI.parse(uri);
    let expected = new Proxy();
    expected.scheme = ProxyScheme.SSR;
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
    let proxies = ProxyURI.parse(uri);
    let expected = new Proxy();
    expected.scheme = ProxyScheme.SSR;
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
    let proxies = ProxyURI.parse(uri);
    let expected = new Proxy();
    expected.scheme = ProxyScheme.SSR;
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
    let proxies = ProxyURI.parse(uri);
    let expected = new Proxy();
    expected.scheme = ProxyScheme.SSR;
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
      let proxies = ProxyURI.parse(uri);
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
      let proxies = ProxyURI.parse(uri);
      expect(proxies.length).toBe(2);  
    }
  })

  it("Multiple SS", () => {
    for (let separator of separators) {
      let uri = ssURIs.join(separator);
      let proxies = ProxyURI.parse(uri);
      expect(proxies.length).toBe(4);  
    }
  })

  it("Multiple SS and SSR", () => {
    for (let separator of separators) {
      let uri = ssrURIs.concat(ssURIs).join(separator);
      let proxies = ProxyURI.parse(uri);
      expect(proxies.length).toBe(6);  
    }
  })
})

describe("test HTTP URI parse", () => {
  it("Plain HTTP Proxy uri", () => {
    let uri = "http://192.168.100.1:8848?remarks=HelloWorld"
    let proxies = ProxyURI.parse(uri);
    let expected = new Proxy();
    expected.scheme = ProxyScheme.HTTP;
    expected.host = "192.168.100.1";
    expected.port = 8848;
    expected.remark = "HelloWorld";
    expect(proxies.length).toBe(1);
    expect(proxies[0]).toEqual(expected);
  })

  it("HTTPS Proxy URI with Basic Auth", () => {
    let uri = "https://user:pass@proxy.example.com:8848?remarks=%f0%9f%87%af%f0%9f%87%b5%e6%97%a5%e6%9c%ac"
    let proxies = ProxyURI.parse(uri);
    let expected = new Proxy();
    expected.scheme = ProxyScheme.HTTPS;
    expected.host = "proxy.example.com";
    expected.port = 8848;
    expected.user = "user";
    expected.password = "pass";
    expected.remark = "🇯🇵日本";
    expect(proxies.length).toBe(1);
    expect(proxies[0]).toEqual(expected);
  })

  it("HTTPS Proxy URI with Url encoded Auth", () => {
    let uri = "https://user%40%2f:pa%3ass@proxy.example.com:8848"
    let proxies = ProxyURI.parse(uri);
    let expected = new Proxy();
    expected.scheme = ProxyScheme.HTTPS;
    expected.host = "proxy.example.com";
    expected.port = 8848;
    expected.user = "user@/";
    expected.password = "pa:ss"
    expect(proxies.length).toBe(1);
    expect(proxies[0]).toEqual(expected);
  })

  it("HTTPS Proxy base64 URI", () => {
    let uri = "https://dXNlciU0MCUyZjpwYSUzYXNzQHByb3h5LmV4YW1wbGUuY29tOjg4NDg=?remarks=%f0%9f%87%af%f0%9f%87%b5%e6%97%a5%e6%9c%ac"
    let proxies = ProxyURI.parse(uri);
    let expected = new Proxy();
    expected.scheme = ProxyScheme.HTTPS;
    expected.host = "proxy.example.com";
    expected.port = 8848;
    expected.user = "user@/";
    expected.password = "pa:ss";
    expected.remark = "🇯🇵日本";
    expect(proxies.length).toBe(1);
    expect(proxies[0]).toEqual(expected);
  })
})