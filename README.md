![License](https://img.shields.io/badge/license-MIT-green.svg)
[![Build Status](https://travis-ci.org/icodesign/proxy-uri.svg?branch=master)](https://travis-ci.org/icodesign/proxy-uri)

`proxy-uri` is a utility to help generate or parse Shadowsocks(R)/HTTP(S) URI.

## Build from source
```
yarn deploy
```

## Usage

### Generate URI
```
import { Proxy } from 'proxy-uri';
proxy.toURI(false);
```

### Parse URI
```
import { ProxyURI } from 'proxy-uri';
let proxies = ProxyURI.parse(uri);
```

More examples can be found in [tests](https://github.com/icodesign/proxy-uri/blob/master/test/index.test.ts).

## Projects

- [Potatso Lite](https://itunes.apple.com/app/id1239860606?mt=8)

## License
`MIT LICENSE`
See `LICENSE` for more details.
