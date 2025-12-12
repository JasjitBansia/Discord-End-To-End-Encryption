## End to End Encryption for Discord DMs

### Installation Steps:

#### Encryption Server Setup

#### (OPTION 1) Docker Setup

1. Install docker: https://www.docker.com/products/docker-desktop/

2. Pull the image: `docker pull jasjitbansia/message-encryption-server`
3. Expose the port: `docker run -d -p 17465:17465 jasjitbansia/message-encryption-server`

4. Run the container. Visit [localhost:17465](http://localhost:17465) to verify

#### (OPTION 2) Binaries

1. Download the binary for you platform from the [releases]() section

2. Execute the binary

#### Extension Setup

- Both parties should have same the same key set for each other
- Container (or binary) should be running for encryption and decryption to happen

<br>
<br>

P.S: Selfbotting is against Discord's ToS. Use at your own risk
