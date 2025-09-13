## End to End Encryption for Discord DMs

### Steps:

#### Docker Setup:

1. Install docker: https://www.docker.com/products/docker-desktop/

2. Pull the image: ```docker pull jasjitbansia/message-encryption-server```
   
4. Expose the port: ```docker run -d -p 17465:17465 jasjitbansia/message-encryption-server```

5. Run the container. Visit [localhost:17465](http://localhost:17465) to verify

#### Extension Setup

* Both parties should have same the same key set for each other
  
* Container should be running for encryption and decryption to happen

<br>
<br>

P.S: My account got temporarily limited one time for ~ 30 mins while developing. Not a big deal, but proceed at your own risk
