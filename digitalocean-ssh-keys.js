const os = require('os');
const path = require('path');
const fs = require('fs-extra');
const DigitalOcean = require('do-wrapper').default;
const token = process.env.DIGITALOCEAN_ACCESS_TOKEN;

const AUTHORIZED_KEYS_PATH = path.resolve(os.homedir(), '.ssh/authorized_keys');

if(!token) {
  console.error(`Missing environment variable 'DIGITALOCEAN_ACCESS_TOKEN'. Get one from https://cloud.digitalocean.com/account/api/tokens`)
  process.exit(1);
}

let doApi = new DigitalOcean(token);

async function start() {
  const sshKeys = await doApi.accountGetKeys().then(response => {

    if(!Array.isArray(response.body.ssh_keys)) {
      throw new Error(`Missing 'ssh_keys' in response`);
    }

    return response.body.ssh_keys;
  });

  await fs.ensureFile(AUTHORIZED_KEYS_PATH);
  await fs.chmod(AUTHORIZED_KEYS_PATH, '0600');

  let authorizedKeysContents = '';

  for(const sshKey of sshKeys) {
    const publicKey = sshKey.public_key;
    authorizedKeysContents += publicKey + '\n';
  }

  await fs.writeFile(AUTHORIZED_KEYS_PATH, authorizedKeysContents);
}

start().catch(err => {
  console.error('[ERROR]', err.message);
  process.exit(1);
});
