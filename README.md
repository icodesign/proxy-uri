`ss-uri` is a utility to help generate or parse Shadowsocks(R) uri.

## Build from source
```
yarn deploy
```

## Usage

### Generate URI
```
import { SSProxy } from 'ss-uri';
proxy.toURI(false);
```

### Parse URI
```
import { SSURI } from 'ss-uri';
let proxies = SSURI.parse(uri);
```

## License
`MIT LICENSE`
See `LICENSE` for more details.