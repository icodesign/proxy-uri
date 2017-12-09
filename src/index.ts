import { Base64 } from 'js-base64';

enum SSScheme {
  SS = "ss://",
  SSR = "ssr://",
}

class SSProxy {
  scheme: SSScheme;
  host: string;
  port: number; 
  authscheme: string;
  password: string;
  protocol?: string = "origin"; 
  protocolParam?: string; 
  obfs?: string = "plain"; 
  obfsParam?: string;
  remark?: string;

  toURI(isSIP002: boolean = false): string {
    switch (this.scheme) {
      case SSScheme.SS:
        return SSURI.generateSS(isSIP002, this.host, this.port, this.authscheme, this.password, this.remark);
      case SSScheme.SSR:
        return SSURI.generateSSR(this.host, this.port, this.authscheme, this.password, this.protocol, this.protocolParam, this.obfs, this.obfsParam, this.remark);
    }
  }
}

class SSURI {

  static base64Pattern = "[A-Za-z0-9/=_-]+";  
  static base64URLSafePattern = "[A-Za-z0-9_-]+";  

  static generate(scheme: SSScheme, isSIP002: boolean, host: string, port: number, method: string, password: string, remark?: string, protocol: string = "origin", protocolParam?: string, obfs: string = "plain", obfsParam?: string): string {
    switch (scheme) {
      case SSScheme.SS:
        return SSURI.generateSS(isSIP002, host, port, method, password, remark)
      case SSScheme.SSR:
        return SSURI.generateSSR(host, port, method, password, remark, protocol, protocolParam, obfs, obfsParam)
    }
  }    
  
  static generateSS(isSIP002: boolean, host: string, port: number, method: string, password: string, remark?: string): string {
    if (isSIP002) {
      let rawUserInfo = method + ":" + password;
      let encodedUserInfo = Base64.encode(rawUserInfo);
      let uri = SSScheme.SS + encodedUserInfo + "@" + host + ":" + port;
      if (remark) {
        uri += "#" + encodeURI(remark);
      }
      return uri;
    } else {
      let rawURI = method + ":" + password + "@" + host + ":" + port;
      let uri = SSScheme.SS + Base64.encode(rawURI);
      if (remark) {
        uri += "#" + remark;
      }
      return uri;
    }
  }

  static generateSSR(host: string, port: number, method: string, password: string, remark?: string, protocol: string = "origin", protocolParam?: string, obfs: string = "plain", obfsParam?: string): string {
    let mainComponents = [host, port, protocol, method, obfs, Base64.encodeURI(password)];
    let paramComponents = new Map<string, string>()
    if (protocolParam) {
      paramComponents.set("protoparam", Base64.encodeURI(protocolParam));
    }
    if (obfsParam) {
      paramComponents.set("obfsparam", Base64.encodeURI(obfsParam));    
    }
    if (remark) {
      paramComponents.set("remarks", Base64.encodeURI(remark));        
    }
    let path = mainComponents.join(":");
    let params = Array.from(paramComponents).map(([key, value]) => (key + "=" + value)).join("&");
    let uri = path;
    if (params.length > 0) {
      uri += "/?" + params;
    }
    uri = Base64.encodeURI(uri);
    return SSScheme.SSR + uri;
  }

  static parse(uri: string): SSProxy[] {
    let uriRegex = /ss:\/\/([^\|\s]+)|ssr:\/\/([^\|\s]+)/gi;
    let match = uriRegex.exec(uri);
    let proxies: SSProxy[] = []
    while (match) {
      let fullUri = match[0]      
      let uriContent = match[1] || match[2]
      if (fullUri && uriContent) {
        if (fullUri.toLowerCase().startsWith(SSScheme.SS)) {
          let proxy = SSURI.parseSSContent(uriContent)
          if (proxy) {
            proxies.push(proxy)
          }
        } else if (fullUri.toLowerCase().startsWith(SSScheme.SSR)) {
          let proxy = SSURI.parseSSRContent(uriContent)
          if (proxy) {
            proxies.push(proxy)
          }
        }
      }
      match = uriRegex.exec(uri);
    }
    return proxies;
  }

  static parseSSContent(uri: string): SSProxy | null {
    // Try SIP 002 first
    let sip002Regex = new RegExp(`^(${SSURI.base64Pattern})@(.+?):(\\d+)(/\?[^#\\s]+?)?(#(.+))?$`, "gi")    
    let match = sip002Regex.exec(uri)
    if (match && match[2] && match[3]) {
      let proxy = new SSProxy();
      proxy.scheme = SSScheme.SS;
      proxy.host = match[2];
      proxy.port = Number(match[3]);
      if (match[6]) {
        proxy.remark = decodeURI(match[6]);
      }
      let userInfo = Base64.decode(match[1]);
      let userInfoRegex = /^(.+?):(.+)/gi
      let userInfoMatch = userInfoRegex.exec(userInfo);
      if (userInfoMatch && userInfoMatch[1] && userInfoMatch[2]) {
        proxy.authscheme = userInfoMatch[1];
        proxy.password = userInfoMatch[2];
        return proxy;
      }
      return null;
    }

    // Try legacy
    let legacyRegex = new RegExp(`^(${SSURI.base64Pattern})(#(.+))?$`, "gi");   
    match = legacyRegex.exec(uri)
    if (match && match.length >= 2) {
      let proxy = new SSProxy();
      proxy.scheme = SSScheme.SS;      
      proxy.remark = match[3];      
      let core = Base64.decode(match[1]);
      // No "$" at the end is due to ShadowsocksX-NG compatibility issue
      // ShadowsocksX-NG will append a remark like "?remark=xxxxx"
      let mainRegex = /^(.+?):(.+)@(.+?):(\d+)/gi
      let coreComps = mainRegex.exec(core);
      if (coreComps && coreComps[1] && coreComps[2] && coreComps[3] && coreComps[4]) {
        proxy.host = coreComps[3];
        proxy.port = Number(coreComps[4]);
        proxy.authscheme = coreComps[1];
        proxy.password = coreComps[2];
        return proxy;
      }
      return null;
    }

    return null;
  }

  static parseSSRContent(uri: string): SSProxy | null {
    let decoded = Base64.decode(uri);
    let coreRegex = new RegExp(`^(.+):(\\d+):(.*):(.+):(.*):(${SSURI.base64URLSafePattern})`, "gi");  
    let coreMatch = coreRegex.exec(decoded);
    if (coreMatch && coreMatch[1] && coreMatch[2] && coreMatch[3] && coreMatch[4] && coreMatch[5] && coreMatch[6]) {
      let base64Password = coreMatch[6];
      let password = Base64.decode(base64Password);
      if (!password) {
        return null;
      }
      let proxy = new SSProxy();
      proxy.scheme = SSScheme.SSR;
      proxy.host = coreMatch[1];
      proxy.port = Number(coreMatch[2]);
      proxy.protocol = coreMatch[3];
      proxy.authscheme = coreMatch[4];
      proxy.obfs = coreMatch[5];
      proxy.password = password;
      let obfsParamRegex = new RegExp(`obfsparam=(${SSURI.base64URLSafePattern})`, "gi");
      let obfsParamMatch = obfsParamRegex.exec(decoded);
      if (obfsParamMatch && obfsParamMatch[1]) {
        proxy.obfsParam = Base64.decode(obfsParamMatch[1]);
      }
      let protocolParamRegex = new RegExp(`protoparam=(${SSURI.base64URLSafePattern})`, "gi");      
      let protocolParamMatch = protocolParamRegex.exec(decoded);
      if (protocolParamMatch && protocolParamMatch[1]) {
        proxy.protocolParam = Base64.decode(protocolParamMatch[1]);
      }
      let remarkRegex = new RegExp(`remarks=(${SSURI.base64URLSafePattern})`, "gi");      
      let remarkMatch = remarkRegex.exec(decoded);
      if (remarkMatch && remarkMatch[1]) {
        proxy.remark = Base64.decode(remarkMatch[1]);
      }
      return proxy;
    }
    return null;
  }
}

export {
  SSScheme,
  SSProxy,
  SSURI
}