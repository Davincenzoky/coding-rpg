const { GoogleAuth } = require('google-auth-library');
const fs = require('fs');

async function deploy() {
  const auth = new GoogleAuth({
    scopes: ['https://www.googleapis.com/auth/firebase', 'https://www.googleapis.com/auth/cloud-platform'],
  });
  
  try {
    const client = await auth.getClient();
    const token = await client.getAccessToken();
    console.log('Got token via ADC');
    
    const project = 'code-defense-a32fd';
    const rules = fs.readFileSync('firestore.rules', 'utf8');
    
    const response = await fetch(
      `https://firebaserules.googleapis.com/v1/projects/${project}/rulesets`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          source: {
            files: [{ name: 'firestore.rules', content: rules }]
          }
        })
      }
    );
    
    const data = await response.json();
    console.log('Ruleset response:', JSON.stringify(data, null, 2));
    
    if (data.name) {
      const releaseResp = await fetch(
        `https://firebaserules.googleapis.com/v1/projects/${project}/releases/cloud.firestore`,
        {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${token.token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: `projects/${project}/releases/cloud.firestore`,
            rulesetName: data.name,
          })
        }
      );
      const releaseData = await releaseResp.json();
      console.log('Release response:', JSON.stringify(releaseData, null, 2));
    }
    
    // Deploy indexes
    const indexes = JSON.parse(fs.readFileSync('firestore.indexes.json', 'utf8'));
    const idxResp = await fetch(
      `https://firestore.googleapis.com/v1/projects/${project}/databases/(default)/indexes`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          collectionGroup: 'chat_messages',
          queryScope: 'COLLECTION',
          fields: [{ fieldPath: 'timestamp', order: 'DESCENDING' }]
        })
      }
    );
    const idxData = await idxResp.json();
    console.log('Index response:', JSON.stringify(idxData, null, 2));
    
  } catch (e) {
    console.error('Failed:', e.message);
    if (e.response) {
      const text = await e.response.text();
      console.error('Response:', text);
    }
  }
}

deploy();
