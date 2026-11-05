Foundit - Stage 2 (all screens, no Firebase yet)
================================================
1. Extract this zip OUTSIDE OneDrive, e.g. C:\dev
2. Open a terminal INSIDE the folder that contains package.json:
      cd C:\dev\Foundit
3. Install the packages:
      npm install
4. Install the photo picker (NEW in Stage 2, picks the right version for your SDK):
      npx expo install expo-image-picker
5. Check versions match your SDK:
      npx expo install --check
6. Run the app (scan the QR code with Expo Go):
      npx expo start -c

DEMO LOGINS (Student ID / password)
  02240189 / password123   Tshering Lhamo (the main demo user)
  02240101 / password123   Alex Wang
  02240102 / password123   Pema Dorji
  02240103 / password123   Sonam Choden
Log out and log in as another user to test the two sides of a claim.
Data is kept in memory only, so it resets when you reload the app.

THINGS TO TRY (as Tshering)
  - Home > Black Wallet (lost): see the 5/5 "Possible match" with Pema's found wallet
  - Open Pema's wallet > "This Is Mine" > answer questions > Claim Submitted
  - Notifications (bell): Alex's claim on your Earbuds > Approve or Reject
  - Profile > My Claims: Water Bottle is approved > tap "I received it" > Resolved
  - Profile > My Claims: Backpack was rejected > Request Review > Under review
  - Post tab: post a Found "Wallet" at Library today, then log in as Tshering/another user and see the match alert

FOLDER GUIDE
  src/data/        constants (categories, locations, stages) and demo seed data
  src/context/     AuthContext (login, register...) and DataContext (posts, claims, chat, notifications)
  src/utils/       matchEngine (+2 category, +2 location, +1 within 3 days), roles, dates, photo picker
  src/screens/     every screen   (auth/ and claims/ are sub-folders)
  src/components/  reusable pieces

STAGE 3 (Firebase) - where to plug it in
  AuthContext.js   login / register / logout / resetPassword / updateProfile / changePassword
  DataContext.js   createItem / submitClaim / approveClaim / rejectClaim / confirmHandover /
                   openChat / sendMessage / notify  -> Firestore writes and onSnapshot listeners
  utils/pickImage  returns a local uri -> upload to Firebase Storage, save the download URL
  matchEngine.js   can move unchanged into a Cloud Function
  Remove the "Demo account" box in screens/auth/LoginScreen.js
  Push (expo-notifications) and email alerts are not built yet (need Firebase).
