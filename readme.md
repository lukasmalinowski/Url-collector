# Url collector

## Getting Started

To get a local copy up and running follow these steps.

### Installation

1. Clone the repo

   ```sh
   git clone https://github.com/lukasmalinowski/xYF1a2FzeiBHb2dvQXBwcyBOQVNB.git
   ```

2. Install NPM packages

   ```sh
   npm install
   ```

3. Create `.env` file in the root of project and insert key/value pairs in the following format of KEY=VALUE:

   ```
   API_URL=https://api.nasa.gov/planetary/apod
   API_KEY=DEMO_KEY
   CONCURRENT_REQUESTS=5
   PORT=8000
   ```

4. Run application
   ```sh
   npm run start:dev
   ```

### Alternatively you can run application using docker

1. Create image from Dockerfile

   ```sh
   docker build -t url-collector .
   ```

2. Start application
   ```sh
   docker run -p 8000:8000 url-collector
   ```

#### Example usage:

```
http://localhost:8000/pictures?from=2022-01-01&to=2022-01-10
```
