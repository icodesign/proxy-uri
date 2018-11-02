`proxy-uri` is a utility to help generate or parse Shadowsocks(R)/HTTP(S) uri.

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
