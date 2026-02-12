# Firebase Configuration Guide

## Current Status
✅ Firebase CLI installed (v14.15.2)  
✅ Authenticated as: nacereddine.houidi@gmail.com  
✅ Firebase Project Created: **streetballer-dev**  
✅ .firebaserc configured with project ID  

## Next Steps: Generate Service Account Credentials

### Step 1: Open Firebase Console
Go to: https://console.firebase.google.com/project/streetballer-dev/settings/serviceaccounts/adminsdk

### Step 2: Generate Service Account Key
1. Click the **"Generate New Private Key"** button
2. A JSON file will automatically download
3. Keep this file safe (contains sensitive credentials)

### Step 3: Extract Credentials
Open the downloaded JSON file and locate these fields:
- `project_id`
- `private_key`
- `client_email`

### Step 4: Update Backend .env File
Edit `backend/.env` and replace the placeholder values with real ones:

```env
# Firebase (Real Credentials)
FIREBASE_PROJECT_ID=streetballer-dev
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@streetballer-dev.iam.gserviceaccount.com
```

⚠️ **Important**: Keep `\n` in the private key string for newlines!

### Step 5: Enable Firebase Services
In Firebase Console, enable these services:
- ✅ Authentication (Email/Password, Google)
- ✅ Firestore Database (optional, using PostgreSQL for now)
- ✅ Cloud Storage (for profile photos, team logos)

### Step 6: Verify Configuration
Run the API test:
```bash
cd backend
npm run dev        # Terminal 1: Start server
node test-api.js   # Terminal 2: Run tests (in another terminal)
```

## Firebase API Documentation
- Authentication: https://firebase.google.com/docs/auth
- Admin SDK: https://firebase.google.com/docs/database/admin/start

## Environment Variables Example
```env
FIREBASE_PROJECT_ID=streetballer-dev
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC7W8/FV1Ej9Bvj\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-abcd1@streetballer-dev.iam.gserviceaccount.com
```

## Troubleshooting
- **"Firebase app does not exist"**: Make sure credentials in .env are correct
- **"Invalid private key"**: Ensure `\n` is preserved in multi-line key strings
- **Authentication fails**: Check that project ID matches exactly
