import ngrok from 'ngrok';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startNgrok() {
  try {
    console.log('Configuring ngrok authtoken...');

    await ngrok.authtoken('38ybRoHpA89E1TGfbHdWjkqRqpG_NqB4EvdT4XKuwjrgMJGb');

    console.log('Starting ngrok tunnel on port 5000...');

    const url = await ngrok.connect(5000);

    console.log('\n========================================');
    console.log('NGROK TUNNEL STARTED!');
    console.log('========================================');
    console.log('Public URL:', url);
    console.log('Callback URL:', `${url}/api/mpesa/callback`);
    console.log('========================================\n');

    // Update .env file with the new callback URL
    const envPath = path.join(__dirname, '.env');
    let envContent = fs.readFileSync(envPath, 'utf8');

    // Replace the callback URL
    envContent = envContent.replace(
      /MPESA_CALLBACK_URL=.*/,
      `MPESA_CALLBACK_URL=${url}/api/mpesa/callback`
    );

    fs.writeFileSync(envPath, envContent);
    console.log('.env updated with new callback URL!');
    console.log('\nNow restart your backend server (npm run dev) in another terminal.');
    console.log('Keep this terminal open to maintain the ngrok tunnel.\n');

    // Keep the process running
    process.stdin.resume();

  } catch (error) {
    console.error('Error starting ngrok:', error.message);
    process.exit(1);
  }
}

startNgrok();
