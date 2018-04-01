# evmasm

EVM (Ethereum Virtual Machine) assembler, WIP

## Global installation and usage

Via npm on Node:

```
npm install -g evmasm
```

Then run
```
evmasm file.asm
```

The output is the compiled bytecode for Ethereum Virtual Machine.

The assembler source code is compatible with the `solc --asm` output (after commenting
some lines starting with `==...`)

Asembler source code sample:

```
// ======= empty.sol:Empty =======

EVM assembly:
    /* "empty.sol":59:78  contract Empty {
... */
  mstore(0x40, 0x60)
  jumpi(tag_1, iszero(callvalue))
  0x0
  dup1
  revert
tag_1:
tag_2:
  dataSize(sub_0)
  dup1
  dataOffset(sub_0)
  0x0
  codecopy
  0x0
  return
stop

sub_0: assembly {
        /* "empty.sol":59:78  contract Empty {
... */
      mstore(0x40, 0x60)
    tag_1:
      0x0
      dup1
      revert

    auxdata: 0xa165627a7a7230582046b5464930e5eb5db6027b5aaae7f9140430cdd322d5eb42de2e546521573bd90029
}

```

Compiled using `solc --asm` from contract source code:
```
// Simple empty contract

contract Empty {
}

```

## Library usage

Install
```
npm instal evmasm
```

Usage
```
var evmasm = require('evmasm');

var bytecode = evmasm.compile('mstore(0x40, 0x60)');

console.log(bytecode); // 6060604052
```



## References

- [Ethereum Project](https://ethereum.org/)

## Samples

TBD

## Versions

0.0.1 - Published

## Contribution

Feel free to [file issues](https://github.com/ajlopez/evmasm) and submit
[pull requests](https://github.com/ajlopez/evmasm/pulls) — contributions are
welcome.

If you submit a pull request, please be sure to add or update corresponding
test cases, and ensure that `npm test` continues to pass.

