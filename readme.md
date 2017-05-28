# SeedBin 🌱 📡 🌐

***Decentralized distributed pastebin using IPFS and WebTorrent.***

## How it works

SeedBin combines WebTorrent and IPFS to create a truly decentralized pastebin while maintaing speed as much as possible.

SeedBin will first try a localhost IPFS gateway, if it is not found then it will try a server URI, and if that doesn't work either, it will try WebTorrent. (all peers seed via WebTorrent if they have WebRTC)

Since the data is just plaintext standard WebTorrent and IPFS clients can download the pastes using their respective hashes.

The server part uses a PHP api "easy ipfs". This software can be installed locally with no dependencies aside from PHP by dropping it into a PHP enabled web server.

The server URI (for submitting) can be set by the user, which is saved in localStorage.

## Security

For the best security it is recommended to run this software (both client and server) on your own hardware. Since WebTorrent uses sha1, WebTorrent pastes can theoretically be spoofed using the shattered attack. IPFS is not affected by shattered.

This software is p2p and therefore exposes your IP address and allows arbitrary people to see what pastes you create or download.

## Planned features

* Syntax highlighting
* Line numbers
* Encrypted pastes

## Donate 💲 🖤

[Consider donating](https://www.chaoswebs.net/donate) to support development.

## License

AGPL3
